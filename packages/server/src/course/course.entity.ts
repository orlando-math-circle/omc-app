import {
  BaseEntity,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { InternalServerErrorException } from '@nestjs/common';
import { EventFee } from '../event-fee/event-fee.entity';
import { Event } from '../event/event.entity';
import { Project } from '../project/project.entity';
import { CourseTimeThreshold } from './enums/course-registration-cutoff.enum';

@Entity()
export class Course extends BaseEntity<Course, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => CourseTimeThreshold)
  cutoffThreshold: CourseTimeThreshold = CourseTimeThreshold.AFTER_LAST_ENDED;

  @Property()
  cutoffOffset: number = 0;

  @Enum(() => CourseTimeThreshold)
  lateThreshold: CourseTimeThreshold = CourseTimeThreshold.AFTER_FIRST_ENDED;

  @Property()
  lateOffset: number = 0;

  @OneToOne(() => EventFee, (ef) => ef.course, {
    owner: true,
    nullable: true,
  })
  fee?: EventFee;

  @ManyToOne(() => Project)
  project!: Project;

  @OneToMany(() => Event, (e) => e.course, {
    orderBy: { dtstart: QueryOrder.ASC },
  })
  events = new Collection<Event>(this);

  /**
   * @returns First event in the course.
   */
  get first() {
    return this.events[0];
  }

  /**
   * @returns Last event in the course.
   */
  get last() {
    return this.events[this.events.length - 1];
  }

  /**
   * Requires events sorted by ascending `dtstart`.
   *
   * @returns Earliest event in the populated events.
   */
  get start() {
    if (!this.events.isInitialized()) return null;

    return this.events[0].dtstart;
  }

  /**
   * Requires events sorted by ascending `dtstart`.
   *
   * @returns Latest event in the populated events.
   */
  get end() {
    if (!this.events.isInitialized()) return null;

    return this.events[this.events.length - 1].dtend;
  }

  /**
   * @returns If the course is available for registrations.
   */
  get isClosed() {
    const firstEnded = this.first.isEnded;
    const lastEnded = this.last.isEnded;

    switch (this.cutoffThreshold) {
      case CourseTimeThreshold.NEVER:
        return false;
      case CourseTimeThreshold.AFTER_FIRST_ENDED:
        return firstEnded;
      case CourseTimeThreshold.AFTER_LAST_ENDED:
        return lastEnded;
      case CourseTimeThreshold.OFFSET:
        let eventsEnded = 0;

        for (const event of this.events) {
          if (event.isClosed) eventsEnded++;
        }

        return eventsEnded > this.cutoffOffset;
      default:
        throw new InternalServerErrorException(
          `Unexpected registration cutoff ${this.cutoffThreshold}`,
        );
    }
  }

  get isLate() {
    const firstEnded = this.first.isEnded;
    const lastEnded = this.last.isEnded;

    switch (this.lateThreshold) {
      case CourseTimeThreshold.NEVER:
        return false;
      case CourseTimeThreshold.AFTER_FIRST_ENDED:
        return firstEnded;
      case CourseTimeThreshold.AFTER_LAST_ENDED:
        return lastEnded;
      case CourseTimeThreshold.OFFSET:
        let eventsEnded = 0;

        for (const event of this.events) {
          if (event.isClosed) eventsEnded++;
        }

        return eventsEnded > this.lateOffset;
      default:
        throw new InternalServerErrorException(
          `Unexpected registration late threshold ${this.lateThreshold}`,
        );
    }
  }
}
