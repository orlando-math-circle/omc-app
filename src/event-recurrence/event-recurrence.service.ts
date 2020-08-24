import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EventRecurrence } from './event-recurrence.entity';

@Injectable()
export class EventRecurrenceService {
  constructor(
    @InjectRepository(EventRecurrence)
    private readonly repository: EntityRepository<EventRecurrence>,
  ) {}

  /**
   * Gets matching dates within a range for an EventRecurrence.
   *
   * @param recurrence EventRecurrence
   * @param dtstart Range starting date
   * @param dtend Range cutoff date
   * @param inclusive Denotes if `dtstart` and `dtend` can also be a match
   */
  public getDates(
    recurrence: EventRecurrence,
    dtstart: Date,
    dtend: Date,
    inclusive = true,
  ) {
    const rule = recurrence.getRRule();

    return rule.between(dtstart, dtend, inclusive);
  }
}
