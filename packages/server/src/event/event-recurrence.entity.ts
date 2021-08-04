import {
  BaseEntity,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Event } from './event.entity';
import { Schedule } from './schedule.class';

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

  @Property()
  points?: number = 0;

  @Property({ nullable: true })
  dtend?: Date;

  @OneToMany(() => Event, (event) => event.recurrence, {
    hidden: true,
    cascade: [Cascade.ALL],
  })
  events: Collection<Event> = new Collection<Event>(this);

  @ManyToOne(() => EventRecurrence, { nullable: true })
  original?: EventRecurrence;

  /**
   * Returns a schedule class from the rrule stored in this entity.
   */
  public getSchedule() {
    return new Schedule(this.rrule);
  }
}
