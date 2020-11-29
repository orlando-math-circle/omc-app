import {
  BaseEntity,
  Collection,
  Entity,
  Enum,
  JsonType,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { addMinutes, differenceInMinutes, isAfter, isBefore } from 'date-fns';
import { getMinutesDiff } from '../app.utils';
import { Course } from '../course/course.entity';
import { EventFee } from '../event-fee/event-fee.entity';
import { EventRegistration } from '../event-registration/event-registration.entity';
import { Project } from '../project/project.entity';
import { ReminderFreq } from '../user/enums/reminder-freq.enum';
import { User } from '../user/user.entity';
import { EventPermissionsDto } from './dto/event-permissions.dto';
import { EventTimeThreshold } from './enums/event-time-threshold.enum';
import { EventRecurrence } from './event-recurrence.entity';

@Entity()
export class Event extends BaseEntity<Event, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Property({ nullable: true })
  location?: string;

  @Property()
  locationTitle!: string;

  @Property()
  picture!: string;

  @Property({ nullable: true })
  color?: string;

  @Property({ type: JsonType, nullable: true })
  permissions?: EventPermissionsDto;

  @Enum(() => EventTimeThreshold)
  cutoffThreshold: EventTimeThreshold = EventTimeThreshold.AFTER_END;

  @Property()
  cutoffOffset: number = 0;

  @Enum(() => EventTimeThreshold)
  lateThreshold: EventTimeThreshold = EventTimeThreshold.AFTER_START;

  @Property()
  lateOffset: number = 0;

  @Property({ default: [] })
  notified: ReminderFreq[];

  @Property({ onUpdate: () => new Date(), hidden: true })
  updatedAt: Date = new Date();

  @Property({ hidden: true })
  createdAt: Date = new Date();

  /**
   * Timing Data
   */

  @Property()
  dtstart!: Date;

  @Property()
  dtend!: Date;

  @Property({ nullable: true })
  originalStart?: Date;

  @OneToOne(() => EventFee, (ef) => ef.event, {
    owner: true,
    nullable: true,
  })
  fee?: EventFee;

  @ManyToOne(() => EventRecurrence, { nullable: true })
  recurrence?: EventRecurrence;

  @OneToMany(() => EventRegistration, (r) => r.event)
  registrations = new Collection<EventRegistration>(this);

  @ManyToOne(() => Course, { nullable: true, eager: true })
  course?: Course;

  @ManyToOne(() => Project, { nullable: true, eager: true })
  project?: Project;

  @ManyToOne(() => User)
  author!: User;

  /**
   * @returns If the event has started.
   */
  @Property({ persist: false })
  get isStarted() {
    return isAfter(new Date(), this.dtstart);
  }

  /**
   * @returns If the event has ended.
   */
  @Property({ persist: false })
  get isEnded() {
    return isAfter(new Date(), this.dtend);
  }

  /**
   * @returns Duration of the event in minutes.
   */
  @Property({ persist: false })
  get duration() {
    return differenceInMinutes(this.dtend, this.dtstart);
  }

  /**
   * @returns If the event is accepting new registrations.
   */
  @Property({ persist: false })
  get isClosed() {
    const started = this.isStarted;
    const ended = this.isEnded;

    // There is currently no "too early" registration limitation.
    if (!started) return false;

    switch (this.cutoffThreshold) {
      case EventTimeThreshold.NEVER:
        return false;
      case EventTimeThreshold.AFTER_START:
        return started;
      case EventTimeThreshold.AFTER_END:
        return ended;
      case EventTimeThreshold.OFFSET_START:
        const startOffset = addMinutes(this.dtstart, this.cutoffOffset);

        return isBefore(startOffset, new Date());
      case EventTimeThreshold.OFFSET_END:
        const endOffset = addMinutes(this.dtend, this.cutoffOffset);

        return isBefore(endOffset, new Date());
      default:
        throw new InternalServerErrorException(
          `Unexpected registration cutoff threshold ${this.cutoffThreshold}`,
        );
    }
  }

  @Property({ persist: false })
  get isLate() {
    const started = this.isStarted;
    const ended = this.isEnded;

    switch (this.lateThreshold) {
      case EventTimeThreshold.NEVER:
        return false;
      case EventTimeThreshold.AFTER_START:
        return started;
      case EventTimeThreshold.AFTER_END:
        return ended;
      case EventTimeThreshold.OFFSET_START:
        const startOffset = addMinutes(this.dtstart, this.lateOffset);

        return isBefore(startOffset, new Date());
      case EventTimeThreshold.OFFSET_END:
        const endOffset = addMinutes(this.dtend, this.lateOffset);

        return isBefore(endOffset, new Date());
      default:
        throw new InternalServerErrorException(
          `Unexpected registration late threshold ${this.lateThreshold}`,
        );
    }
  }

  /**
   * Returns the most accurate starting time for an event.
   * This is used when exceptions are inside the event loop.
   */
  public start() {
    return this.originalStart || this.dtstart;
  }

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

  /**
   * Checks if a user fits the permissions of an event.
   * TODO: Add default permissions, e.g. adults not being able to register.
   *
   * @param user User
   */
  public hasPermission(user: User) {
    if (!this.permissions) return true;

    const { grades, genders } = this.permissions;

    if (genders && !genders.includes(user.gender)) return false;

    if (grades && !grades.includes(user.grade)) return false;

    return true;
  }
}
