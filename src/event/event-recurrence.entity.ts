import {
  BaseEntity,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import RRule, { RRuleSet, rrulestr } from 'rrule';
import { Event } from './event.entity';

@Entity()
export class EventRecurrence extends BaseEntity<EventRecurrence, 'id'> {
  constructor(
    rrule: string,
    start: Date,
    end?: Date,
    original?: EventRecurrence,
  ) {
    super();
    this.rrule = rrule;
    this.dtstart = start;
    this.dtend = end;
    this.original = original;
  }

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  rrule!: string;

  @Property()
  dtstart!: Date;

  @Property({ nullable: true })
  dtend?: Date;

  /**
   * Relationships
   */

  @OneToMany(() => Event, (event) => event.recurrence, { hidden: true })
  events: Collection<Event> = new Collection<Event>(this);

  @ManyToOne(() => EventRecurrence, { nullable: true })
  original?: EventRecurrence;

  /**
   * Methods
   */

  /**
   * Returns a `RRule` or `RRuleSet` class from the rule in this entity.
   * If exceptions are found, an `RRuleSet` is created.
   *
   * @param forceset Forces the generation of a `RRuleSet`.
   */
  public getRRule<T extends boolean>(
    forceset?: T,
  ): T extends true ? RRuleSet : RRuleSet | RRule {
    return rrulestr(this.rrule, { forceset }) as any;
  }
}
