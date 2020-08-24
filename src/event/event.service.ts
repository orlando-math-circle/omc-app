import { EntityRepository, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import moment from 'moment';
import RRule, { Options } from 'rrule';
import { diffObject, isSameDay } from '../app.utils';
import { EventRecurrence } from '../event-recurrence/event-recurrence.entity';
import { EventRecurrenceService } from '../event-recurrence/event-recurrence.service';
import { User } from '../user/user.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { UpdateEventsDto } from './dtos/update-events.dto';
import { Event } from './event.entity';
import { RRuleOptions } from './interfaces/rrule.interface';

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

    // If the event isn't all day, calculate its duration.
    if (dtend) {
      event.duration = Math.round(
        (dtend.getTime() - dtstart.getTime()) / 60000,
      );
    }

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
   * Hydrates a RRule into the individual event instances and attaches
   * them in the instances relationship.
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

      const dtend = events[0].dtend
        ? moment(date).add(events[0].duration, 'minutes').toDate()
        : null;

      newEvents.push(
        new Event().assign(
          {
            name: events[0].name,
            description: events[0].description,
            picture: events[0].picture,
            color: events[0].color,
            dtstart: date,
            dtend,
            duration: events[0].duration,
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
   * Modifies an event instance as an exception. If the modifications
   * are temporal a reference to the original times is maintained.
   *
   * @param id event id
   * @param updateEventDto UpdateEventDto object
   */
  public async updateSingleEvent(
    id: number,
    { dtstart, dtend, rrule, ...meta }: UpdateEventDto,
  ) {
    const event = await this.eventRepository.findOneOrFail(id);

    if (dtstart) {
      event.originalStart = event.dtstart;
      event.dtstart = dtstart;
    }

    if (dtend) {
      event.originalEnd = event.dtend;
      event.dtend = dtend;
    }

    event.assign({ ...meta });

    return this.eventRepository.flush();
  }

  private getSplitRules(oldRRuleString: string, newOpts?: Partial<Options>) {
    if (!newOpts) return;

    const newRRule = new RRule(newOpts);

    if (oldRRuleString === newRRule.toString()) return;

    const oldRRule = RRule.fromString(oldRRuleString);

    const oldRRuleSplitOpts = oldRRule.origOptions;
    oldRRuleSplitOpts.until = newOpts.dtstart;
    delete oldRRuleSplitOpts.count;

    const splitOldRRule = new RRule(oldRRuleSplitOpts);

    const diff = diffObject(oldRRule.origOptions, newRRule as any);

    return {
      old: {
        original: oldRRule,
        split: splitOldRRule,
      },
      new: newRRule,
      canShift: this.canShiftEvents(oldRRule.origOptions, diff),
    };
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

  /**
   * Modifies the selected event instance and any future events. If the
   * modifications are temporal, the `EventRecurrence` is split into two.
   *
   * @param id event id
   * @param updateEventDto UpdateEventDto object
   */
  public async updateFutureEvents(id: number, updateEventDto: UpdateEventsDto) {
    const { duration, rrule: rruleOpts, meta } = updateEventDto;
    const pivotEvent = await this.eventRepository.findOneOrFail(id, true);
    const pivotDate = pivotEvent.dtstart;

    let newRecurrence: EventRecurrence;
    let canShift: boolean;

    if (rruleOpts) {
      const oldRRule = RRule.fromString(pivotEvent.recurrence.rrule);
      const oldRRuleSplit = this.shortenRRule(oldRRule, rruleOpts.dtstart);

      // Prevent the split from accidentally resetting `count`
      if (
        oldRRule.options.count &&
        rruleOpts.count &&
        rruleOpts.count === oldRRule.options.count
      ) {
        rruleOpts.count - oldRRuleSplit.count();
      }

      const rrule = new RRule(rruleOpts, false);

      pivotEvent.recurrence.rrule = oldRRuleSplit.toString();

      newRecurrence = new EventRecurrence(
        rrule.toString(),
        rruleOpts.dtstart,
        rruleOpts.until,
        pivotEvent.recurrence,
      );

      // This is not currently implemented.
      // canShift = this.canShiftEvents(oldRRule.origOptions, rruleOpts);
    }

    for (const event of pivotEvent.recurrence.events) {
      // Don't change events before the pivot.
      if (event.dtstart < pivotDate) continue;

      // Remove events after the pivot if we cannot shift the rule.
      if (!canShift && !(event.dtstart === pivotDate)) {
        this.eventRepository.remove(event);
        continue;
      }

      if (duration) {
        event.dtend = moment(event.dtstart).add(duration, 'minutes').toDate();
      }

      if (newRecurrence) {
        newRecurrence.events.add(event);
      }

      if (meta) {
        event.assign({ ...meta });
      }
    }

    // Prevent orphaned `EventRecurrence` entities.
    if (!pivotEvent.recurrence.events.count) {
      this.recurrenceRepository.remove(newRecurrence.original);
    }

    return this.eventRepository.flush();
  }

  /**
   * FIXME: This is not a complete or even remotely reasonable way of going about this.
   * See `docs/calendar-update-interaction.md`.
   */
  private canShiftEvents(oldOpts: RRuleOptions, newOpts: RRuleOptions) {
    const diff = diffObject(oldOpts, newOpts);
    const keys = Object.keys(diff) as Array<keyof typeof diff>;

    // Check if the new options contains keys that aren't these.
    if (
      keys.some(
        (opt) => opt !== 'dtstart' && opt !== 'until' && opt !== 'count',
      )
    ) {
      return false;
    }

    //
    if (diff.dtstart && oldOpts.dtstart > diff.dtstart) {
      throw new BadRequestException('Cannot backdate a recurrence rule');
    }

    // The starting date can only be shifted if it's on the same day.
    if (diff.dtstart && !isSameDay(diff.dtstart, oldOpts.dtstart)) {
      return false;
    }

    // Added a range cutoff or the cutoff date is now sooner.
    if (diff.until && (!oldOpts.until || oldOpts.until > diff.until)) {
      return false;
    }

    // A count was added, or the count is lower than before.
    if (diff.count && (!oldOpts.count || oldOpts.count > diff.count)) {
      return false;
    }

    return true;
  }

  public async updateAllEvents(id: number, updateEventDto: UpdateEventDto) {
    return { id, updateEventDto };
  }
}
