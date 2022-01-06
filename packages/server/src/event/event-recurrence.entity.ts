import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { isString, toDate } from '@omc/shared';
import RRule, { RRuleSet, rrulestr } from 'rrule';
import { RRuleDto } from '..';
import { Event } from './event.entity';
import { Schedule } from './schedule.class';

@Entity()
export class EventRecurrence {
  private _rruleObj?: RRule | RRuleSet;

  constructor(options: string | RRuleDto) {
    if (isString(options)) {
      this.rrule = options;
      this._rruleObj = rrulestr(options);
    } else {
      this._rruleObj = new RRule({
        ...options,
        dtstart: toDate(options.dtstart),
        until: options.until ? toDate(options.until) : undefined,
      });
    }
  }

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  rrule!: string;

  @Property()
  dtstart!: Date;

  @Property()
  points?: number = 0;

  @Property({ nullable: true })
  dtend?: Date;

  @OneToMany(() => Event, (e) => e.temporal.recurrence, {
    hidden: true,
    cascade: [Cascade.ALL],
  })
  events = new Collection<Event>(this);

  @ManyToOne(() => EventRecurrence, { nullable: true })
  original?: EventRecurrence;

  get rruleObj() {
    if (!this._rruleObj) {
      this._rruleObj = rrulestr(this.rrule);
    }

    return this._rruleObj;
  }

  get options() {
    if (this.rruleObj instanceof RRuleSet) {
      return this.rruleObj.rrules()[0].origOptions;
    }

    return this.rruleObj.origOptions;
  }

  get first() {
    return this.rruleObj.after(this.dtstart, true);
  }

  /**
   * Returns a schedule class from the rrule stored in this entity.
   */
  public getSchedule() {
    return new Schedule(this.rrule);
  }
}
