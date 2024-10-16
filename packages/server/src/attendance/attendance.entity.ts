import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';
import { VolunteerJob } from '../volunteer-job/volunteer-job.entity';
import { VolunteerWork } from '../volunteer-work/volunteer-work.entity';

@Entity()
@Unique({ properties: ['event', 'user'] })
export class Attendance extends BaseEntity<Attendance, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  attended!: boolean;

  @Property({ persist: false })
  hours!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Event)
  event!: Event;

  @ManyToOne(() => VolunteerJob, { nullable: true })
  job!: VolunteerJob;

  @ManyToOne(() => VolunteerWork, { nullable: true })
  work?: VolunteerWork;
}
