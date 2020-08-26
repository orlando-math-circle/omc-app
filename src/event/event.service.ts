import {
  EntityRepository,
  FilterQuery,
  QueryOrder,
  QueryOrderMap,
} from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import moment from 'moment';
import RRule from 'rrule';
import { addMinutes, isAfterDay, isBeforeDay, isSameDay } from '../app.utils';
import { EventRecurrence } from '../event-recurrence/event-recurrence.entity';
import { EventRecurrenceService } from '../event-recurrence/event-recurrence.service';
import { User } from '../user/user.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventMetaDto } from './dtos/event-meta.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { UpdateEventsDto } from './dtos/update-events.dto';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    @InjectRepository(EventRecurrence)
    private readonly recurrenceRepository: EntityRepository<EventRecurrence>,
    private readonly recurrenceService: EventRecurrenceService,
    private readonly em: SqlEntityManager,
  ) {}

  /**
   * Creates a single event or a recurring event stream.
   *
   * @param createEventDto CreateEventDto
   * @param author User author
   */
  async create(createEventDto: CreateEventDto, author: User) {
    const { dtstart, dtend, recurring, ...meta } = createEventDto;
    const event = new Event().assign(
      {
        dtstart,
        dtend,
        author,
        ...meta,
      },
      { em: this.em },
    );

    // Recurring events generate recurrence rules.
    if (recurring) {
      const rrule = new RRule(recurring);
      const recurrence = new EventRecurrence(
        rrule.toString(),
        recurring.dtstart,
        recurring.until,
      );

      event.recurrence = recurrence;
    }

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
      dtend: { $lte: end.toISOString() },
      recurrence: null,
    });

    const recurrences = await this.recurrenceRepository.find(
      {
        dtstart: { $gte: start.toISOString() },
        dtend: { $lte: end.toISOString() },
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

    return this.eventRepository.flush();
  }

  public test() {
    const start = new Date('2020-07-15T10:00:00.000Z');
    const end = new Date('2020-07-20T10:00:00.000Z');

    const rrule = new RRule({
      freq: 3,
      dtstart: start,
      until: end,
    });

    return { events: rrule.between(start, end, true), start, end };
  }

  /**
   * Modifies the selected event instance and any future events. If the
   * modifications are temporal, the `EventRecurrence` is split into two.
   *
   * @param id event id
   * @param updateEventDto UpdateEventDto object
   */
  public async updateFutureEvents(id: number, updateEventDto: UpdateEventsDto) {
    const { dtend, rrule: rruleOpts, meta } = updateEventDto;
    const pivot = await this.eventRepository.findOneOrFail(
      id,
      ['recurrence.events'],
      {
        recurrence: { events: { dtstart: QueryOrder.ASC } },
      },
    );
    const events = pivot.recurrence.events;

    // No RRule changes, update topical data and return.
    if (!rruleOpts) {
      this.updateEventStream(pivot, events, null, null, dtend, meta);

      return this.eventRepository.flush();
    }

    const oldRRule = pivot.recurrence.getRRule();

    // Checks if we're making an update to the entire event stream.
    if (isSameDay(rruleOpts.dtstart, oldRRule.origOptions.dtstart)) {
      return this.updateAllEvents(pivot.recurrence, updateEventDto);
    }

    const dayBefore = moment(rruleOpts.dtstart).subtract(1, 'day').toDate();
    const oldRRuleSplit = this.shortenRRule(oldRRule, dayBefore);

    // Prevent the split from resetting `count`
    if (
      oldRRule.options.count &&
      rruleOpts.count &&
      rruleOpts.count === oldRRule.options.count
    ) {
      rruleOpts.count - oldRRuleSplit.count();
    }

    const rrule = new RRule(rruleOpts, false);

    pivot.recurrence.rrule = oldRRuleSplit.toString();
    pivot.recurrence.dtend = dayBefore;

    const newRecurrence = new EventRecurrence(
      rrule.toString(),
      rruleOpts.dtstart,
      rruleOpts.until,
      pivot.recurrence,
    );

    const duration = moment(dtend || pivot.dtend).diff(
      rruleOpts.dtstart,
      'minutes',
    );

    pivot.dtstart = rruleOpts.dtstart;
    pivot.dtend = dtend || addMinutes(pivot.dtstart, duration);

    const dateIterator = rrule
      .between(rruleOpts.dtstart, events[events.length - 1].dtend, true)
      .values();

    this.updateEventStream(
      pivot,
      pivot.recurrence.events,
      newRecurrence,
      dateIterator,
      dtend,
      meta,
    );

    return this.eventRepository.flush();
  }

  public async updateAllEvents(id: number, updateEventDto: UpdateEventDto);
  public async updateAllEvents(
    recurrence: EventRecurrence,
    updateEventDto: UpdateEventDto,
  );
  public async updateAllEvents(
    idOrRecurrence: number | EventRecurrence,
    { dtend, rrule: rruleOpts, meta }: UpdateEventDto,
  ) {
    const recurrence =
      typeof idOrRecurrence === 'number'
        ? await this.recurrenceRepository.findOneOrFail(
            { events: { id: idOrRecurrence } },
            ['recurrence.events'],
            {
              recurrence: { events: { dtstart: QueryOrder.ASC } },
            },
          )
        : idOrRecurrence;

    // This is called pivot for consistency, but is arbitrarily
    // the first event that exists in this collection.
    const pivot = recurrence.events[0];

    if (!rruleOpts) {
      this.updateEventStream(
        pivot,
        recurrence.events,
        recurrence,
        null,
        dtend,
        meta,
      );

      return this.eventRepository.flush();
    }

    const rrule = new RRule(rruleOpts, false);

    recurrence.rrule = rrule.toString();
    recurrence.dtstart = rruleOpts.dtstart;

    if (rruleOpts.until) {
      recurrence.dtend = rruleOpts.until;
    }

    const duration = moment(dtend || pivot.dtend).diff(
      rruleOpts.dtstart,
      'minutes',
    );

    pivot.dtstart = rruleOpts.dtstart;
    pivot.dtend =
      dtend || moment(pivot.dtstart).add(duration, 'minutes').toDate();

    const dateIterator = rrule
      .between(
        rruleOpts.dtstart,
        pivot.recurrence.events[pivot.recurrence.events.length - 1].dtend,
        true,
      )
      .values();

    this.updateEventStream(
      pivot,
      recurrence.events,
      null,
      dateIterator,
      dtend,
      meta,
    );

    return this.eventRepository.flush();
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
  private async updateEventStream(
    pivot: Event,
    events: Iterable<Event>,
    recurrence?: EventRecurrence,
    dateIterator?: IterableIterator<Date>,
    dtend?: Date,
    meta?: UpdateEventMetaDto,
  ) {
    let date: IteratorResult<Date, Date> = dateIterator?.next();

    for (const event of events) {
      // Don't change events before the pivot. Only meaningful to a "future events" update.
      if (event.dtstart < pivot.dtstart) continue;

      if (recurrence) {
        // If the date is before this event date, fast-forward.
        while (!date.done && isBeforeDay(date.value, event.dtstart)) {
          date = dateIterator.next();
        }

        // Overshooting an event, or running out of dates, means the event is now gone.
        if (date.done || isAfterDay(date.value, event.dtstart)) {
          this.eventRepository.remove(event);
          continue;
        }

        // If we got here the event should be on the same day.

        if (date.done || !isSameDay(date.value, event.dtstart)) {
          throw new InternalServerErrorException('Event date misalignment');
        }

        // This does nothing for "all events" updates.
        event.recurrence = recurrence;
      }

      if (dtend) {
        // This prevents an event starting after it ended, how confusing.
        if (event.dtstart > dtend) {
          event.dtstart = pivot.dtstart;
        }
        event.dtend = dtend;
      }

      if (meta) {
        event.assign({ ...meta });
      }
    }
  }

  /**
   * Hydrates a RRule into the individual event instances and attaches
   * them in the instances relationship.
   *
   * @param recurrence EventRecurrence
   * @param start Beginning date range
   * @param end Ending date range
   */
  public async getRecurrenceEvents(
    recurrence: EventRecurrence,
    start: Date,
    end: Date,
  ) {
    if (!recurrence.events.isInitialized()) {
      await recurrence.events.loadItems();
    }

    const dates = this.recurrenceService.getDates(recurrence, start, end);
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
        new Event().assign(
          {
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
          },
          { em: this.em },
        ),
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

    return new RRule(options, false);
  }
}
