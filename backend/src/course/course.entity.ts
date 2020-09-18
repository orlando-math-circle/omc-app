import {
  BaseEntity,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { Event } from '../event/event.entity';
import { Project } from '../project/project.entity';
import { LatePaymentType } from './enums/late-payment-type.enum';
import { PaymentType } from './enums/payment-type.enum';

@Entity()
export class Course extends BaseEntity<Course, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => PaymentType)
  paymentType!: PaymentType;

  @Enum(() => LatePaymentType)
  latePaymentType!: LatePaymentType;

  @Property({ nullable: true })
  fee?: string;

  @Property({ nullable: true })
  lateFee?: string;

  /**
   * Computed Properties
   */

  /**
   * Returns the earliest event in the populated events.
   *
   * Requires events sorted by ascending `dtstart`.
   */
  get start() {
    if (!this.events.isInitialized) return null;

    return this.events[0].dtstart;
  }

  /**
   * Returns the latest event in the populated events.
   *
   * Requires events sorted by ascending `dtstart`.
   */
  get end() {
    if (!this.events.isInitialized) return null;

    return this.events[this.events.length - 1].dtend;
  }

  /**
   * Relationships
   */

  @ManyToOne(() => Project)
  project!: Project;

  @OneToMany(() => Event, (e) => e.course, {
    orderBy: { dtstart: QueryOrder.ASC },
  })
  events = new Collection<Event>(this);
}
