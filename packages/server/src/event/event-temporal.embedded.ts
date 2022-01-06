import { Embeddable, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { addMinutes, differenceInMinutes, isFuture, isPast } from 'date-fns';
import { EventTimeThreshold } from './enums';
import { EventRecurrence } from './event-recurrence.entity';

@Embeddable()
export class EventTemporal {
  @Property()
  dtstart!: Date;

  @Property()
  dtend!: Date;

  @Property({ nullable: true })
  originalStart?: Date;

  @Enum(() => EventTimeThreshold)
  cutoffThreshold: EventTimeThreshold = EventTimeThreshold.AFTER_END;

  @Property()
  cutoffOffset: number = 0;

  @Enum(() => EventTimeThreshold)
  lateThreshold: EventTimeThreshold = EventTimeThreshold.AFTER_START;

  @Property()
  lateOffset: number = 0;

  @ManyToOne(() => EventRecurrence, { nullable: true })
  recurrence?: EventRecurrence;

  /**
   * @returns Is it past the event start date and time?
   */
  @Property({ persist: false })
  get isStarted(): boolean {
    return isPast(this.dtstart);
  }

  /**
   * @returns Is it past the event end date and time?
   */
  @Property({ persist: false })
  get isEnded() {
    return isPast(this.dtend);
  }

  /**
   * @returns The event duration from `dtstart` until `dtend` in minutes.
   */
  @Property({ persist: false })
  get duration() {
    return differenceInMinutes(this.dtend, this.dtstart);
  }

  /**
   * @returns Is the event is accepting new registrations?
   */
  @Property({ persist: false })
  get isAcceptingRegistrations() {
    const isStarted = this.isStarted;
    const isEnded = this.isEnded;

    // There is no current implementation for preventing event
    // registrations because it is too soon before `dtstart`.
    if (!isStarted) return true;

    switch (this.cutoffThreshold) {
      case EventTimeThreshold.NEVER:
        return true;
      case EventTimeThreshold.AFTER_START:
        return !isStarted;
      case EventTimeThreshold.AFTER_END:
        return !isEnded;
      case EventTimeThreshold.OFFSET_START:
        const offsettedStart = addMinutes(this.dtstart, this.cutoffOffset);

        return isFuture(offsettedStart);
      case EventTimeThreshold.OFFSET_END:
        const endOffset = addMinutes(this.dtend, this.cutoffOffset);

        return isFuture(endOffset);
    }
  }
}
