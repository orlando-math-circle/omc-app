import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateEventDto } from '..';
import {
  addMinutes,
  getMinDate,
  getMinutesDiff,
  isAfterDay,
  isBeforeDay,
  isBoolean,
  isSameDay,
  subDays,
} from '../app.utils';
import { ConfigService } from '../config/config.service';
import { CourseService } from '../course/course.service';
import { CreateEventFeeDto } from '../event-fee/dto/create-event-fee.dto';
import { EventFee } from '../event-fee/event-fee.entity';
import { User } from '../user/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { FindAllRegisteredEventsDto } from './dto/find-all-registered-events.dto';
import { FeeType } from './enums/fee-type.enum';
import { EventRecurrence } from './event-recurrence.entity';
import { Event } from './event.entity';
import { EventMetadata } from './interfaces/event-metadata.interface';
import { Schedule } from './schedule.class';

export type Mode = 'single' | 'future' | 'all';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    public readonly eventRepository: EntityRepository<Event>,
    @InjectRepository(EventRecurrence)
    private readonly recurrenceRepository: EntityRepository<EventRecurrence>,
    private readonly courseService: CourseService,
    private readonly config: ConfigService,
    private readonly em: SqlEntityManager,
  ) {}

  /**
   * Creates a single event or a recurring event stream.
   *
   * @param createEventDto CreateEventDto
   * @param author User author
   */
  async create(dto: CreateEventDto, author: User) {
    const { courseId, projectId, metadata, temporal, fee: createFeeDto } = dto;

    const event = this.eventRepository.create({
      author,
      course: courseId,
      project: projectId,
      metadata,
      temporal: {
        dtend: new Date(temporal.dtend),
      },
    });

    if (temporal.mode === 'single') {
      event.temporal.dtstart = new Date(temporal.dtstart);
    } else if (temporal.mode === 'recurring') {
      const recurrence = new EventRecurrence(temporal.rrule);

      this.eventRepository.assign(event, {
        temporal: {
          // Ensure that the first created event is the first occurrence.
          dtstart: recurrence.first,
          recurrence,
        },
      });
    }

    if (createFeeDto && createFeeDto.type !== FeeType.FREE) {
      const fee = new EventFee(createFeeDto);

      if (createFeeDto.type === FeeType.COURSE) {
        if (!courseId) {
          throw new BadRequestException(
            'Course is required for fee type COURSE',
          );
        }

        this.eventRepository.assign(event, { course: { fee } });
      } else {
        this.eventRepository.assign(event, { fee });
      }
    }

    if (!event.metadata.picture) {
      event.metadata.picture = this.config.FILES.DEFAULT_EVENT_PICTURE;
    }

    await this.eventRepository.persist(event).flush();

    return event;
  }

  /**
   * Finds all upcoming events a user is registered to attend or volunteer for.
   *
   * @param findAllRegisteredEventsDto Query parameters.
   * @param user User to find registrations for.
   */
  async findAllRegistered(
    { limit, offset, volunteering }: FindAllRegisteredEventsDto,
    user: User,
  ) {
    return this.eventRepository.findAndCount(
      {
        registrations: {
          user: user.id,
          ...(isBoolean(volunteering) ? { volunteering } : {}),
        },
      },
      { limit, offset, orderBy: { temporal: { dtstart: QueryOrder.ASC } } },
    );
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
            dtstart: { $lte: end },
            dtend: { $gte: start },
          },
          projects && { project: { id: projects } },
        ),
        { populate: ['course', 'fee', 'project', 'author'] },
      ),
      this.recurrenceRepository.find(
        Object.assign(
          {
            dtstart: { $lte: end },
            $or: [{ dtend: { $gte: start } }, { dtend: null }],
          },
          projects && { events: { project: { id: projects } } },
        ),
      ),
    ]);

    await this.recurrenceRepository.populate(
      recurrences,
      ['events.course', 'events.fee', 'events.project', 'events.author'],
      {
        where: {
          events: {
            temporal: {
              dtstart: { $lte: end },
              $or: [{ dtend: { $gte: start } }, { dtend: null }],
            },
          },
        },
      },
    );

    let reference: Event | null;
    for (const recurrence of recurrences) {
      // If the recurrence does not have any events we need to find
      // the first to use it as a reference.

      // TODO: Consider an alternative to this as metadata exceptions
      // made to this queried reference will permeate to new hydrations.
      if (!recurrence.events.length) {
        reference = await this.eventRepository.findOne(
          { temporal: { recurrence } },
          { populate: ['course', 'fee', 'project', 'author'] },
        );
      } else {
        reference = recurrence.events[0];
      }

      // If we still don't have a reference, the recurrence somehow has no events.
      if (!reference) {
        this.recurrenceRepository.remove(recurrence);
      } else {
        this.getRecurrenceEvents(recurrence, reference, start, end);
      }
    }

    await this.recurrenceRepository.flush();

    const allEvents: Event[] = [...events];

    for (const recurrence of recurrences) {
      for (const event of recurrence.events) {
        // This avoids the parentEvent from being added to this list.
        if (event.temporal.dtstart >= start && event.temporal.dtend <= end) {
          allEvents.push(event);
        }
      }
    }

    return allEvents.sort((a, b) => +a.temporal.dtstart - +b.temporal.dtstart);
  }

  /**
   * Updates a fee as appropriate
   *
   * @param event Event for upserting event fee into.
   * @param feeType FeeType
   * @param createEventDto Amount and optional late fee amountt.
   */
  public async upsertEventFee(
    event: Event,
    feeType: FeeType,
    { amount, lateAmount }: CreateEventFeeDto,
  ) {
    switch (feeType) {
      case FeeType.FREE:
        if (event.fee) this.eventRepository.remove(event.fee);
        if (event.course?.fee) this.eventRepository.remove(event.course.fee);
        break;
      case FeeType.EVENT:
        if (event.fee) {
          event.fee.amount = amount;
          event.fee.lateAmount = lateAmount;
        } else {
          event.fee = new EventFee({ amount, lateAmount });
        }

        if (event.course?.fee) {
          this.eventRepository.remove(event.course.fee);
        }
        break;
      case FeeType.COURSE:
        if (!event.course) {
          throw new BadRequestException(
            'Cannot add course fee to event without course',
          );
        }

        if (!event.course.isInitialized()) {
          await this.eventRepository.populate(event, ['course']);
        }

        if (event.course.fee) {
          event.course.fee.amount = amount;
          event.course.fee.lateAmount = lateAmount;
        } else {
          event.course.fee = new EventFee({ amount, lateAmount });
        }

        if (event.fee) {
          this.eventRepository.remove(event.fee);
        }
        break;
    }
  }

  /**
   * Retrieves the pivot event and populates it with the
   * appropriate data for the updating mode.
   *
   * @param id - Id of the event to update, or start an update from.
   * @param mode - Methodology used in the update.
   */
  private async getUpdatingPivot(id: number, mode: Mode) {
    let pivot = await this.eventRepository.findOneOrFail(id);

    switch (mode) {
      case 'single': {
        return this.eventRepository.findOneOrFail(id, {
          populate: ['fee', 'course.fee'],
        });
      }
      case 'future': {
        return this.eventRepository.findOneOrFail(id, {
          populate: [
            'fee',
            'course.fee',
            'temporal.recurrence.events.fee',
            'temporal.recurrence.events.course.fee',
          ],
          having: {
            temporal: {
              recurrence: {
                events: {
                  temporal: { dtstart: { $gte: pivot.temporal.dtstart } },
                },
              },
            },
          },
        });
      }

      case 'all': {
        await this.em.populate(
          pivot,
          [
            'fee',
            'course.fee',
            'temporal.recurrence.events.fee',
            'temporal.recurrence.events.course.fee',
          ],
          {
            orderBy: {
              temporal: {
                recurrence: {
                  events: { temporal: { dtstart: QueryOrder.ASC } },
                },
              },
            },
          },
        );

        // Ensure we're selecting the first chronological event
        // in the recurrence if we weren't already.
        if (pivot.temporal.recurrence) {
          pivot = pivot.temporal.recurrence.events[0];
        }

        return pivot;
      }
    }
  }

  public async update(id: number, mode: Mode, updateEventDto: UpdateEventDto) {
    const pivot = await this.getUpdatingPivot(id, mode);

    // If the event is non-recurring, multi-event modes are invalid.
    if (mode !== 'single' && !pivot.temporal.recurrence) {
      throw new BadRequestException(
        'Cannot update non-recurring event by mode: ' + mode,
      );
    }

    // Each mode has a different procedure for updating the rrule.
    if (updateEventDto.rrule) {
      switch (mode) {
        case 'single':
          // Changing an existing rrule for a single event is an illegal operation.
          if (pivot.temporal.recurrence) {
            throw new BadRequestException(
              'Cannot change the rrule of a single event',
            );
          }

          // However, we can add new rrules to non-recurring events.
          if (updateEventDto.rrule) {
            const recurrence = new EventRecurrence(updateEventDto.rrule);
            // TODO: Finish
          }
          break;

        case 'future':
        // TODO: Incomplete
      }
    }
  }

  /**
   * Modifies an event instance as an exception. If the modifications
   * are temporal a reference to the original times is maintained.
   *
   * @param id event id
   * @param updateEventDto UpdateEventDto object
   */
  public async updateSingleEvent(id: number, updateEventDto: UpdateEventDto) {
    const { dtstart, dtend, fee, ...meta } = updateEventDto;
    const event = await this.eventRepository.findOneOrFail(id, [
      'fee',
      'course.fee',
    ]);

    if (dtstart) {
      event.originalStart = event.dtstart;
      event.dtstart = new Date(dtstart);
    }

    if (dtend) {
      event.dtend = new Date(dtend);
    }

    event.assign({ ...meta });

    if (fee?.type) {
      await this.upsertEventFee(event, fee.type, fee);
    }

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
  public async updateFutureEvents(id: number, updateEventDto: UpdateEventDto) {
    const { dtend, rrule, ...meta } = updateEventDto;
    const pivot = await this.eventRepository.findOneOrFail(id, [
      'fee',
      'course.fee',
      'recurrence.events.fee',
      'recurrence.events.course.fee',
    ]);

    // Edge-Case: There is no recurrence thus no "all" to update.
    if (!pivot.recurrence) {
      // If we're given an rrule, we can work with this.
      if (rrule) {
        const schedule = new Schedule(rrule);
        const recurrence = new EventRecurrence(
          schedule.toString(),
          new Date(rrule.dtstart),
          rrule.until ? new Date(rrule.until) : undefined,
        );
        recurrence.events.add(pivot);
        pivot.recurrence = recurrence;

        this.recurrenceRepository.persist(recurrence);
      }

      // From here on we know we aren't interested in complex rrule changes.
      return this.updateSingleEvent(pivot.id, updateEventsDto);
    }

    // No RRule changes, update topical data and return.
    if (!rrule) {
      return this.setEventData(pivot, pivot.recurrence.events, dtend, meta);
    }

    const oldSchedule = pivot.recurrence.getSchedule();

    // Checks if we're making an update to the entire event stream.
    if (isSameDay(pivot.dtstart, oldSchedule.dtstart)) {
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

    await this.setEventData(
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
    updateEventsDto: UpdateEventsDto,
  ) {
    const { dtend, rrule, ...meta } = updateEventsDto;
    let pivot: Event;
    let recurrence: EventRecurrence | undefined;

    if (typeof idOrRecurrence === 'number') {
      // This may not be the ideal pivot as we need the earliest
      // event in a recurrence, regardless of the event selected.
      const event = await this.eventRepository.findOneOrFail(
        idOrRecurrence,
        [
          'fee',
          'course.fee',
          'recurrence.events.fee',
          'recurrence.events.course.fee',
        ],
        {
          recurrence: { events: { dtstart: QueryOrder.ASC } },
        },
      );

      recurrence = event.recurrence;
      pivot = event.recurrence!.events[0];
    } else {
      recurrence = idOrRecurrence;
      pivot = recurrence.events[0];
    }

    // Edge-Case: There is no recurrence thus no "all" to update.
    if (!recurrence) {
      // If we're given an rrule, we can work with this.
      if (rrule) {
        const schedule = new Schedule(rrule);
        const recurrence = new EventRecurrence(
          schedule.toString(),
          rrule.dtstart,
          rrule.until,
        );
        recurrence.events.add(pivot);
        pivot.recurrence = recurrence;

        this.recurrenceRepository.persist(recurrence);
      }

      // From here on we know we aren't interested in complex rrule changes.
      return this.updateSingleEvent(pivot.id, updateEventsDto);
    }

    const pivotCache = this.eventRepository.create({ ...pivot });

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

    await this.setEventData(
      pivot,
      recurrence.events,
      dtend,
      meta,
      recurrence,
      iterator,
    );

    // If we deleted all of our events that's quite upsetting.
    if (!recurrence.events.length) {
      const start = schedule.first();
      const end = addMinutes(start, pivotCache.duration);

      this.getRecurrenceEvents(recurrence, pivotCache, start, end);

      await this.recurrenceRepository.flush();
    }
  }

  /**
   * Removes an event by creating an event exception.
   *
   * @param id ID of the event being removed.
   */
  public async deleteSingleEvent(id: number) {
    const event = await this.eventRepository.findOneOrFail(id, [
      'recurrence',
      'registrations',
    ]);

    // If there is a recurrence, we need to add an exclusion.
    if (event.recurrence) {
      const rruleSet = event.recurrence.getSchedule();

      rruleSet.exdate(event.dtstart);
      event.recurrence.rrule = rruleSet.toString();
    }

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
      ['recurrence.events.registrations', 'registrations'],
      { recurrence: { events: { dtstart: QueryOrder.ASC } } },
    );
    const schedule = pivot.recurrence!.getSchedule();

    // Deleting the first event in a recurrence is equivalent to an "all" deletion.
    // This doesn't use the schedule's dtstart because it may misaligned with the rrule.
    if (+schedule.first() === +pivot.start()) {
      this.recurrenceRepository.remove(pivot.recurrence!);

      return this.recurrenceRepository.flush();
    }

    const dayBefore = subDays(pivot.dtstart, 1);
    const shortenedRRule = this.shortenRRule(schedule, dayBefore);

    pivot.recurrence!.rrule = shortenedRRule.toString();
    pivot.recurrence!.dtend = dayBefore;

    // Remove all events that are after (or on) the pivot date.
    for (const event of pivot.recurrence!.events) {
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
      'recurrence.events.registrations',
    ]);

    this.recurrenceRepository.remove(event.recurrence!);

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
    const { start, duration } = this.setPivotData(pivot, recurrence, dtend);

    for (const event of events) {
      // Don't change events before the pivot for `future event` updates.
      if (event.start() < start) continue;

      if (recurrence && dateIterator) {
        let iteratorDate = dateIterator.next();
        // If the date is before this event date, fast-forward.
        while (
          !iteratorDate.done &&
          isBeforeDay(iteratorDate.value, event.start())
        ) {
          iteratorDate = dateIterator.next();
        }

        // Overshooting an event, running out of dates, being overlapped
        // by the pivot is cause for event destruction.
        if (
          iteratorDate.done ||
          isAfterDay(iteratorDate.value, event.start()) ||
          (event.id !== pivot.id && isSameDay(pivot.dtstart, event.start()))
        ) {
          this.eventRepository.remove(event);
          continue;
        }

        // Once we reach this point the event starts on the same day.
        if (event.id !== pivot.id) {
          event.recurrence = recurrence;
          event.dtstart = iteratorDate.value;
          event.originalStart = undefined;
        }
      }

      if (duration && event.id !== pivot.id) {
        event.setEndDate(addMinutes(event.dtstart, duration));
      }

      if (meta) {
        const { feeType, fee, ...rest } = meta;

        event.assign({ ...rest });

        if (feeType && fee) {
          this.upsertEventFee(event, feeType, fee);
        }
      }
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
      pivot.originalStart = undefined;
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
   * @param reference Event for copying metadata.
   * @param start Date signifying the beginning of the date range.
   * @param end Date signifying the end of the date range.
   */
  private getRecurrenceEvents(
    recurrence: EventRecurrence,
    reference: Event,
    start: Date,
    end: Date,
  ) {
    const dates = recurrence.getSchedule().between(start, end);
    const events = recurrence.events.getItems();
    const durationInMinutes = reference.duration;

    for (const date of dates) {
      let event = events.find(
        (e) =>
          +e.dtstart === +date ||
          (e.originalStart && +e.originalStart === +date),
      );

      if (event) {
        event.recurrence!.populated();
        continue;
      }

      const meta: EventMetadata = {
        name: reference.name,
        description: reference.description,
        location: reference.location,
        locationTitle: reference.locationTitle,
        picture: reference.picture,
        color: reference.color,
        permissions: reference.permissions,
        cutoffThreshold: reference.cutoffThreshold,
        cutoffOffset: reference.cutoffOffset,
        lateThreshold: reference.lateThreshold,
        lateOffset: reference.lateOffset,
        fee: reference.fee
          ? new EventFee({
              amount: reference.fee.amount,
              lateAmount: reference.fee.lateAmount,
            })
          : undefined,
        author: reference.author,
        course: reference.course,
        project: reference.project,
        recurrence: recurrence,
      };

      event = this.eventRepository.create({
        ...meta,
        dtstart: date,
        dtend: addMinutes(date, durationInMinutes),
      });
    }

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
}
