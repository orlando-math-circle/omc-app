import {
  EntityRepository,
  FilterQuery,
  Populate,
  QueryOrder,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_EVENT_PICTURE } from '../app.constants';
import {
  addMinutes,
  getMinDate,
  getMinutesDiff,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  PopulateFail,
  subDays,
} from '../app.utils';
import { CourseService } from '../course/course.service';
import { EventFee } from '../event-fee/event-fee.entity';
import { User } from '../user/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventsDto } from './dto/update-events.dto';
import { FeeType } from './enums/fee-type.enum';
import { EventRecurrence } from './event-recurrence.entity';
import { Event } from './event.entity';
import { Schedule } from './schedule.class';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    @InjectRepository(EventRecurrence)
    private readonly recurrenceRepository: EntityRepository<EventRecurrence>,
    private readonly courseService: CourseService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Creates a single event or a recurring event stream.
   *
   * @param createEventDto CreateEventDto
   * @param author User author
   */
  async create(createEventDto: CreateEventDto, author: User) {
    const { dtstart, dtend, rrule, feeType, fee, ...meta } = createEventDto;

    const event = this.eventRepository.create({
      dtstart: rrule ? rrule.dtstart : dtstart,
      dtend,
      author,
      ...meta,
    });

    if (feeType) {
      const eventFee = new EventFee(fee);

      switch (feeType) {
        case FeeType.COURSE:
          eventFee.course = await this.courseService.findOneOrFail(meta.course);
          break;
        case FeeType.EVENT:
          eventFee.event = event;
          break;
        default:
          break;
      }
    }

    if (rrule) {
      const schedule = new Schedule(rrule);
      event.recurrence = new EventRecurrence(
        schedule.toString(),
        event,
        schedule.dtstart,
        schedule.dtend,
      );
    }

    if (!event.picture) {
      event.picture = this.config.get(DEFAULT_EVENT_PICTURE);
    }

    await this.eventRepository.persist(event).flush();

    return event;
  }

  /**
   * Finds an existing event entity or throws an error.
   *
   * @param where Id or query of event parameters.
   * @param populate Boolean, attribute array, or population options.
   * @param orderBy Query for element ordering.
   */
  async findOneOrFail(
    where: FilterQuery<Event>,
    populate?: PopulateFail<Event>,
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
  async findAll({ start, end, projects }: FindAllEventsDto) {
    const [events, recurrences] = await Promise.all([
      this.eventRepository.find(
        Object.assign(
          {
            recurrence: null,
            dtend: { $gte: start },
            dtstart: { $lte: end },
          },
          projects && { project: { id: projects } },
        ),
        ['course', 'author'],
      ),
      this.recurrenceRepository.find(
        Object.assign(
          {
            dtstart: { $lte: end },
            $or: [{ dtend: { $gte: start } }, { dtend: null }],
          },
          projects && { events: { project: { id: projects } } },
        ),
        ['events.course', 'parentEvent'],
      ),
    ]);

    await this.recurrenceRepository.populate(
      recurrences,
      'events',
      Object.assign({
        events: {
          dtstart: { $lte: end },
          $or: [{ dtend: { $gte: start } }, { dtend: null }],
        },
      }),
    );

    await Promise.all(
      recurrences.map((recurrence) =>
        this.getRecurrenceEvents(recurrence, start, end),
      ),
    );

    const allEvents: Event[] = [...events];

    for (const recurrence of recurrences) {
      for (const event of recurrence.events) {
        // This avoids the parentEvent from being added to this list.
        if (event.dtstart >= start && event.dtend <= end) {
          allEvents.push(event);
        }
      }
    }

    return allEvents.sort((a, b) => +a.dtstart - +b.dtstart);
  }

  /**
   * Modifies an event instance as an exception. If the modifications
   * are temporal a reference to the original times is maintained.
   *
   * @param id event id
   * @param updateEventDto UpdateEventDto object
   */
  public async updateSingleEvent(id: number, updateEventDto: UpdateEventDto) {
    const { dtstart, dtend, ...meta } = updateEventDto;
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
    const { dtend, rrule, ...meta } = updateEventsDto;
    const pivot = await this.eventRepository.findOneOrFail(
      id,
      ['recurrence.events'],
      {
        recurrence: { events: { dtstart: QueryOrder.ASC } },
      },
    );

    // No RRule changes, update topical data and return.
    if (!rrule) {
      return this.setEventData(pivot, pivot.recurrence.events, dtend, meta);
    }

    const oldSchedule = pivot.recurrence.getSchedule();

    // Checks if we're making an update to the entire event stream.
    if (isSameDay(rrule.dtstart, oldSchedule.dtstart)) {
      return this.updateAllEvents(pivot.recurrence, updateEventsDto);
    }

    const oldRRuleCutoff = subDays(getMinDate(rrule.dtstart, pivot.dtstart), 1);
    const oldRRuleSplit = this.shortenRRule(oldSchedule, oldRRuleCutoff);

    // Prevent the split from resetting `count`
    if (
      oldSchedule.options.count &&
      rrule.count &&
      rrule.count === oldSchedule.options.count
    ) {
      rrule.count -= oldRRuleSplit.count();
    }

    const schedule = new Schedule(rrule);

    pivot.recurrence.rrule = oldRRuleSplit.toString();
    pivot.recurrence.dtend = oldRRuleCutoff;

    const newRecurrence = new EventRecurrence(
      schedule.toString(),
      pivot,
      rrule.dtstart,
      rrule.until,
      pivot.recurrence,
    );

    let end = pivot.recurrence.events[pivot.recurrence.events.length - 1].dtend;

    // If there is no end or its after the start, at minimum preserve the new pivot.
    // Without this, moving a pivot past the existing event range removes the pivot.
    if (!end || rrule.dtstart > end) {
      end = rrule.dtstart;
    }

    const dates = schedule.between(rrule.dtstart, end).values();

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
    { dtend, rrule, ...meta }: UpdateEventDto,
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

    if (!rrule) {
      return this.setEventData(pivot, recurrence.events, dtend, meta);
    }

    const schedule = new Schedule(rrule);

    recurrence.rrule = schedule.toString();
    recurrence.dtstart = rrule.dtstart;
    recurrence.dtend = rrule.until || schedule.dtend;

    // Obtains all viable new dates for the range of existing events.
    const iterator = schedule
      .between(
        rrule.dtstart,
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
    const rruleSet = event.recurrence.getSchedule();

    rruleSet.exdate(event.dtstart);
    event.recurrence.rrule = rruleSet.toString();

    return this.eventRepository.remove(event).flush();
  }

  /**
   * Removes an event and events following it by shortening
   * the associated `rrule` to before this event.
   *
   * @param id ID of the pivot event to remove it and subsequent events.
   */
  public async deleteFutureEvents(id: number) {
    const pivot = await this.eventRepository.findOneOrFail(
      id,
      ['recurrence.events'],
      { recurrence: { events: { dtstart: QueryOrder.ASC } } },
    );
    const schedule = pivot.recurrence.getSchedule();

    // Deleting the first event in a recurrence is equivalent to an "all" deletion.
    // This doesn't use the schedule's dtstart because it may misaligned with the rrule.
    if (+schedule.first() === +pivot.start()) {
      this.recurrenceRepository.remove(pivot.recurrence);

      return this.recurrenceRepository.flush();
    }

    const dayBefore = subDays(pivot.dtstart, 1);
    const shortenedRRule = this.shortenRRule(schedule, dayBefore);

    pivot.recurrence.rrule = shortenedRRule.toString();
    pivot.recurrence.dtend = dayBefore;

    // Remove all events that are after (or on) the pivot date.
    for (const event of pivot.recurrence.events) {
      if (event.start() < pivot.start()) continue;

      this.eventRepository.remove(event);
    }

    return this.eventRepository.flush();
  }

  /**
   * Deletes all events using a single event ID by targeting
   * the associated EventRecurrence.
   *
   * @param id ID of an event to delete the recurrence of.
   */
  public async deleteAllEvents(id: number) {
    const event = await this.eventRepository.findOneOrFail(id, [
      'recurrence.events',
    ]);

    this.recurrenceRepository.remove(event.recurrence);

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
  private async setEventData(
    pivot: Event,
    events: Iterable<Event>,
    dtend?: Date,
    meta?: Omit<UpdateEventsDto, 'dtend' | 'rrule'>,
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
   * @param recurrence EventRecurrence to hydrate.
   * @param start Date signifying the beginning of the date range.
   * @param end Date signifying the end of the date range.
   */
  private async getRecurrenceEvents(
    recurrence: EventRecurrence,
    start: Date,
    end: Date,
  ) {
    const dates = recurrence.getSchedule().between(start, end);
    const events = recurrence.events.getItems();
    const durationInMinutes = recurrence.parentEvent.duration;

    for (const date of dates) {
      let event = events.find(
        (e) => +e.dtstart === +date || +e.originalStart === +date,
      );

      if (event) {
        event.recurrence.populated();
        continue;
      }

      // TODO: Split this into an event factory function.
      // This has to be manually updated whenever the event structure is changed.
      event = this.eventRepository.create({
        name: recurrence.parentEvent.name,
        description: recurrence.parentEvent.description,
        location: recurrence.parentEvent.location,
        locationTitle: recurrence.parentEvent.locationTitle,
        picture: recurrence.parentEvent.picture,
        color: recurrence.parentEvent.color,
        permissions: recurrence.parentEvent.permissions,
        dtstart: date,
        dtend: addMinutes(date, durationInMinutes),
        author: recurrence.parentEvent.author,
        course: recurrence.parentEvent.course,
        recurrence,
      });

      recurrence.events.add(event);
    }

    // This will not do anything if no events are added.
    await this.recurrenceRepository.flush();

    return recurrence;
  }

  /**
   * Returns a new Schedule instance where an until date is added.
   * If a count exists, it is removed.
   *
   * @param schedule Schedule instance.
   * @param until Date to end the schedule.
   */
  private shortenRRule(schedule: Schedule, until: Date) {
    const options = Object.assign({}, schedule.options);

    delete options.count;
    options.until = until;

    return new Schedule(options);
  }

  /**
   * Loads relations on event entities.
   *
   * @param entities Event or events to populate.
   * @param populate The relations to attempt to populate.
   * @param where Query for population.
   */
  public async populate<P extends string | keyof Event | Populate<Event>>(
    entities: Event | Event[],
    populate: P,
    where: FilterQuery<Event>,
  ) {
    return this.eventRepository.populate(entities, populate, where);
  }
}
