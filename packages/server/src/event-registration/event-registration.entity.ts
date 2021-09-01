import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Event } from '../event/event.entity';
import { Invoice } from '../invoice/invoice.entity';
import { User } from '../user/user.entity';
import { VolunteerJob } from '../volunteer-job/volunteer-job.entity';
import { VolunteerWork } from '../volunteer-work/volunteer-work.entity';

@Entity()
@Unique({ properties: ['event', 'user'] })
export class EventRegistration extends BaseEntity<EventRegistration, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  volunteering: boolean = false;

  @Property()
  isCoverable: boolean = false;

  @ManyToOne(() => Event, { eager: false })
  event!: Event;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => VolunteerJob, { nullable: true })
  job?: VolunteerJob;

  @ManyToOne(() => VolunteerWork, { nullable: true })
  work?: VolunteerWork;

  @OneToOne(() => Invoice, (i) => i.registration, {
    nullable: true,
    owner: true,
  })
  invoice?: Invoice;
}
