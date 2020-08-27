import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import { getMinutesDiff } from '../app.utils';
import { User } from '../user/user.entity';
import { EventRecurrence } from './event-recurrence.entity';

@Entity()
export class Event extends BaseEntity<Event, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  picture?: string;

  @Property({ nullable: true })
  color?: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Timing Data
   */

  @Property()
  dtstart!: Date;

  @Property({ nullable: true })
  dtend?: Date;

  @Property({ nullable: true })
  originalStart?: Date;

  /**
   * Relationships
   */

  @ManyToOne(() => EventRecurrence, { nullable: true, hidden: true })
  recurrence?: EventRecurrence;

  @ManyToOne(() => User)
  author!: User;

  // project?: Project;

  // registrations?: EventRegistration[];

  /**
   * Methods
   */

  /**
   * Sets a new end date on an event, if possible.
   * If necessary, this will remove an exception start time.
   *
   * @param dtend New ending date.
   */
  public setEndDate(dtend: Date) {
    // The starting date is after the ending date, disgusting!
    if (dtend < this.dtstart) {
      // Reset an exception to apply this dtend, if possible.
      if (this.originalStart && this.originalStart < dtend) {
        this.dtstart = this.originalStart;
        this.originalStart = null;
      } else {
        throw new BadRequestException('dtstart after dtend');
      }
    }

    this.dtend = dtend;
  }

  /**
   * Returns the duration of an event in minutes.
   */
  public getDuration() {
    return getMinutesDiff(this.dtstart, this.dtend);
  }
}
