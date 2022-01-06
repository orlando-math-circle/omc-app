import {
  Cascade,
  Collection,
  Embedded,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import { Course } from '../course/course.entity';
import { EventFee } from '../event-fee/event-fee.entity';
import { EventRegistration } from '../event-registration/event-registration.entity';
import { Project } from '../project/project.entity';
import { ReminderFreq } from '../user/enums/reminder-freq.enum';
import { User } from '../user/user.entity';
import { EventMetadata } from './event-metadata.embedded';
import { EventTemporal } from './event-temporal.embedded';

@Entity()
export class Event {
  @PrimaryKey()
  id!: number;

  @Property({ default: [] })
  notified!: ReminderFreq[];

  @Embedded(() => EventMetadata)
  metadata!: EventMetadata;

  @Embedded(() => EventTemporal)
  temporal!: EventTemporal;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ hidden: true })
  createdAt: Date = new Date();

  @OneToOne(() => EventFee, (f) => f.event, {
    owner: true,
    nullable: true,
  })
  fee?: EventFee;

  @OneToMany(() => EventRegistration, (r) => r.event, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  registrations = new Collection<EventRegistration>(this);

  @ManyToOne(() => Course, { nullable: true, eager: true })
  course?: Course;

  @ManyToOne(() => Project, { nullable: true, eager: true })
  project?: Project;

  @ManyToOne(() => User)
  author!: User;

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
        this.originalStart = undefined;
      } else {
        throw new BadRequestException('dtstart after dtend');
      }
    }

    this.dtend = dtend;
  }
}
