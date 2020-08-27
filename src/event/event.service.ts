import {
  EntityRepository,
  FilterQuery,
  QueryOrder,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import moment from 'moment';
import RRule, { RRuleSet } from 'rrule';
import {
  addMinutes,
  getMinDate,
  getMinutesDiff,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  subDays,
} from '../app.utils';
import { User } from '../user/user.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventMetaDto } from './dtos/event-meta.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { UpdateEventsDto } from './dtos/update-events.dto';
import { EventRecurrence } from './event-recurrence.entity';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    @InjectRepository(EventRecurrence)
    private readonly recurrenceRepository: EntityRepository<EventRecurrence>,
  ) {}

  /**
   * Creates a single event or a recurring event stream.
   *
   * @param createEventDto CreateEventDto
   * @param author User author
   */
  async create(createEventDto: CreateEventDto, author: User) {
    const { dtstart, dtend, rrule: rruleOpts, ...meta } = createEventDto;

    if (!rruleOpts) {
      const event = this.eventRepository.create({
        dtstart,
        dtend,
        author,
        ...meta,
      });

      await this.eventRepository.persist(event).flush();

      return event;
    }

    const recurrence = new EventRecurrence(
      new RRule(rruleOpts).toString(),
      rruleOpts.dtstart,
      rruleOpts.until,
    );

    const event = this.eventRepository.create({
      dtstart: rruleOpts.dtstart,
      dtend,
      author,
      recurrence,
      ...meta,
    });

    await this.eventRepository.persist(event).flush();

    return event;
  }

  async findOne(
    where: FilterQuery<Event>,
    populate?: boolean | string[],
    orderBy?: QueryOrderMap,
  ) {
    return this.eventRepository.findOne(where, populate, orderBy);
  }

  async findOneOrFail(
    where: FilterQuery<Event>,
    populate?: boolean | string[],
    orderBy?: QueryOrderMap,
  ) {
    return this.eventRepository.findOneOrFail(where, populate, orderBy);
  }

  /**
   * Retrieves all events within a date range inclusively. This method
   * will hydrate any events that do not yet exist in this range for
   * a recurrence rule.
   *
   * @param start Start of the range
   * @param end End of the range
   */
  async findAll(start: Date, end: Date) {
    const events = await this.eventRepository.find({
      dtstart: { $gte: start.toISOString() },
      $or: [
        {
          dtend: { $lte: end.toISOString() },
        },
        {
          dtend: null,
        },
      ],
      recurrence: null,
    });

    const recurrences = await this.recurrenceRepository.find(
      {
        dtstart: { $gte: start.toISOString() },
        $or: [
          {
            dtend: { $lte: end.toISOString() },
          },
          {
            dtend: null,
          },
        ],
      },
      ['events'],
    );

    for (const recurrence of recurrences) {
      events.push(...(await this.getRecurrenceEvents(recurrence, start, end)));
    }

    return events.sort((a, b) => +a.dtstart - +b.dtstart);
  }

  /**
   * Modifies an event instance as an exception. If the modifications
   * are temporal a reference to the original times is maintained.
   *
   * @param id event id
   * @param updateEventDto UpdateEventDto object
   */
  public async updateSingleEvent(id: number, updateEventDto: UpdateEventDto) {
    const { dtstart, dtend, meta } = updateEventDto;
    const event = await this.eventRepository.findOneOrFail(id);

    if (dtstart) {
      event.originalStart = event.dtstart;
      event.dtstart = dtstart;
    }

    if (dtend) {
      event.dtend = dtend;
    }

    event.assign({ ...meta });

    await this.eventRepository.flush();

    return event;
  }

  /**
   * Modifies the selected event instance and any future events. If the
   * modifications are temporal, the `EventRecurrence` is split into two.
   *
   * @param id event id
   * @param updateEventDto UpdateEventDto object
   */
  public async updateFutureEvents(
    id: number,
    updateEventsDto: UpdateEventsDto,
  ) {
    const { dtend, rrule: rruleOpts, meta } = updateEventsDto;
    const pivot = await this.eventRepository.findOneOrFail(
      id,
      ['recurrence.events'],
      {
        recurrence: { events: { dtstart: QueryOrder.ASC } },
      },
    );

    // No RRule changes, update topical data and return.
    if (!rruleOpts) {
      return this.setEventData(pivot, pivot.recurrence.events, dtend, meta);
    }

    const oldRRule = pivot.recurrence.getRRule();

    // Checks if we're making an update to the entire event stream.
    if (isSameDay(rruleOpts.dtstart, oldRRule.origOptions.dtstart)) {
      return this.updateAllEvents(pivot.recurrence, updateEventsDto);
    }

    const oldRRuleCutoff = subDays(
      getMinDate(rruleOpts.dtstart, pivot.dtstart),
      1,
    );
    const oldRRuleSplit = this.shortenRRule(oldRRule, oldRRuleCutoff);

    // Prevent the split from resetting `count`
    if (
      oldRRule.options.count &&
      rruleOpts.count &&
      rruleOpts.count === oldRRule.options.count
    ) {
      rruleOpts.count = rruleOpts.count - oldRRuleSplit.count();
    }

    const rrule = new RRule(rruleOpts);

    pivot.recurrence.rrule = oldRRuleSplit.toString();
    pivot.recurrence.dtend = oldRRuleCutoff;

    const newRecurrence = new EventRecurrence(
      rrule.toString(),
      rruleOpts.dtstart,
      rruleOpts.until,
      pivot.recurrence,
    );

    const lastEvent =
      pivot.recurrence.events[pivot.recurrence.events.length - 1];
    const dates = rrule
      .between(rruleOpts.dtstart, lastEvent.dtend, true)
      .values();

    return this.setEventData(
      pivot,
      pivot.recurrence.events,
      dtend,
      meta,
      newRecurrence,
      dates,
    );
  }

  /**
   * Updates all of the events within a recurrence rule. The event
   * selected is unimportant as the recurrence is acted upon.
   *
   * @param idOrRecurrence ID of an event or the recurrence itself.
   * @param updateEventDto UpdateEventDto.
   */
  public async updateAllEvents(
    idOrRecurrence: number | EventRecurrence,
    { dtend, rrule: rruleOpts, meta }: UpdateEventDto,
  ): Promise<void> {
    const recurrence =
      typeof idOrRecurrence === 'number'
        ? (
            await this.eventRepository.findOneOrFail(
              idOrRecurrence,
              ['recurrence.events'],
              {
                recurrence: { events: { dtstart: QueryOrder.ASC } },
              },
            )
          ).recurrence
        : idOrRecurrence;

    // This is called pivot for consistency, but is arbitrarily
    // the first event that exists in this collection.
    const pivot = recurrence.events[0];

    if (!rruleOpts) {
      return this.setEventData(pivot, recurrence.events, dtend, meta);
    }

    const rrule = new RRule(rruleOpts, false);

    recurrence.rrule = rrule.toString();
    recurrence.dtstart = rruleOpts.dtstart;
    recurrence.dtend = rruleOpts.until || null;

    // Obtains all viable new dates for the range of existing events.
    const iterator = rrule
      .between(
        rruleOpts.dtstart,
        recurrence.events[recurrence.events.length - 1].dtend,
        true,
      )
      .values();

    return this.setEventData(
      pivot,
      recurrence.events,
      dtend,
      meta,
      recurrence,
      iterator,
    );
  }

  /**
   * Removes an event by creating an event exception.
   *
   * @param id ID of the event being removed.
   */
  public async deleteSingleEvent(id: number) {
    const event = await this.eventRepository.findOneOrFail(id, ['recurrence']);
    const rruleSet = event.recurrence.getRRule(true);

    rruleSet.exdate(event.dtstart);
    event.recurrence.rrule = rruleSet.toString();

    return this.eventRepository.remove(event).flush();
  }

  /**
   * Given a stream of events, this method will rectify any necessary
   * changes as contextually necessary from the arguments.
   *
   * @param pivot Event instance being updated, or first event
   * @param events Iterable array or collection of events
   * @param recurrence Optional. Recurrence rule to apply to the events
   * @param dateIterator Optional. Iterator housing the dates for the range of events
   * @param dtend Optional. Dtend date to apply to all events
   * @param meta Optional. Meta information to apply to all events
   */
  private async setEventData(
    pivot: Event,
    events: Iterable<Event>,
    dtend?: Date,
    meta?: UpdateEventMetaDto,
    recurrence?: EventRecurrence,
    dateIterator?: IterableIterator<Date>,
  ) {
    let dates: IteratorResult<Date, Date> = dateIterator?.next();
    const { start, duration } = this.setPivotData(pivot, recurrence, dtend);

    for (const event of events) {
      // Don't change events before the pivot for `future event` updates.
      if (event.start() < start) continue;

      if (recurrence) {
        // If the date is before this event date, fast-forward.
        while (!dates.done && isBeforeDay(dates.value, event.start())) {
          dates = dateIterator.next();
        }

        // Overshooting an event, running out of dates, being overlapped
        // by the pivot is cause for event destruction.
        if (
          dates.done ||
          isAfterDay(dates.value, event.start()) ||
          (event.id !== pivot.id && isSameDay(pivot.dtstart, event.start()))
        ) {
          this.eventRepository.remove(event);
          continue;
        }

        // Once we reach this point the event starts on the same day.
        if (event.id !== pivot.id) {
          event.recurrence = recurrence;
          event.dtstart = dates.value;
          event.originalStart = null;
        }
      }

      if (duration && event.id !== pivot.id) {
        event.setEndDate(addMinutes(event.dtstart, duration));
      }

      if (meta) event.assign({ ...meta });
    }

    return this.eventRepository.flush();
  }

  /**
   * Prepares the event pivot for the event updating loop.
   * This will return the original pivot starting time
   * and the duration of the pivot event.
   *
   * @param pivot First event, or event being updated.
   * @param recurrence New recurrence if `rrule` is changed.
   * @param dtend New ending date, if changed.
   */
  private setPivotData(
    pivot: Event,
    recurrence?: EventRecurrence,
    dtend?: Date,
  ) {
    let duration: number;
    const originalStart = pivot.dtstart;

    if (recurrence) {
      pivot.recurrence = recurrence;
      pivot.dtstart = recurrence.dtstart;
      pivot.originalStart = null;
    }

    if (dtend) {
      pivot.setEndDate(dtend);
      duration = pivot.getDuration();
    } else {
      // If the time was changed the end date of the pivot may be wrong.
      duration = getMinutesDiff(originalStart, pivot.dtend);
      pivot.setEndDate(addMinutes(pivot.dtstart, duration));
    }

    return { start: originalStart, duration };
  }

  /**
   * Hydrates a RRule into the individual event instances and attaches
   * them in the instances relationship.
   *
   * @param recurrence EventRecurrence
   * @param start Beginning date range
   * @param end Ending date range
   */
  private async getRecurrenceEvents(
    recurrence: EventRecurrence,
    start: Date,
    end: Date,
  ) {
    const dates = recurrence.getRRule().between(start, end, true);
    const events = recurrence.events.getItems();
    const newEvents = [];
    const duration = events[0].dtend
      ? moment(events[0].dtend).diff(events[0].dtstart, 'minutes')
      : null;

    for (const date of dates) {
      const event = events.find(
        (e) => +e.dtstart === +date || +e.originalStart === +date,
      );

      if (event) continue;

      // Recurring event metadata is obtained from the first event
      // instance. If it is deleted manually this event recurrence
      // is no longer valid. This could be a silent warning.

      if (!events[0]) {
        throw new InternalServerErrorException(
          'Event recurrence has no events',
        );
      }

      newEvents.push(
        this.eventRepository.create({
          name: events[0].name,
          description: events[0].description,
          picture: events[0].picture,
          color: events[0].color,
          dtstart: date,
          dtend: duration
            ? moment(date).add(duration, 'minutes').toDate()
            : null,
          author: events[0].author,
          recurrence,
        }),
      );
    }

    if (newEvents.length) {
      await this.eventRepository.persist(newEvents).flush();
    }

    return recurrence.events;
  }

  /**
   * Returns a newly created `RRule` instance with a new `until` ending date.
   * If the `RRule` had a `count` specified, it is removed.
   *
   * @param rrule RRule
   * @param date until Date
   */
  private shortenRRule(rrule: RRule, date: Date) {
    const options = rrule.origOptions;

    delete options.count;
    options.until = date;

    const rruleSet = new RRuleSet();

    rruleSet.rrule(new RRule(options));

    return rruleSet;
  }
}
