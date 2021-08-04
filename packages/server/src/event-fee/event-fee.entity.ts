import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { InternalServerErrorException } from '@nestjs/common';
import { Course } from '../course/course.entity';
import { Event } from '../event/event.entity';
import { Invoice } from '../invoice/invoice.entity';

@Entity()
export class EventFee extends BaseEntity<EventFee, 'id'> {
  constructor(data: { amount: string; lateAmount?: string }) {
    super();

    this.amount = data.amount;
    this.lateAmount = data.lateAmount;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  amount!: string;

  @Property({ nullable: true })
  lateAmount?: string;

  @OneToOne(() => Event, (e) => e.fee, { nullable: true })
  event?: Event;

  @OneToOne(() => Course, (c) => c.fee, { nullable: true })
  course?: Course;

  @ManyToMany({
    entity: () => Invoice,
    owner: true,
  })
  invoices = new Collection<Invoice>(this);

  get cost() {
    let isLate: boolean;

    if (this.event) {
      isLate = this.event.isLate;
    } else if (this.course) {
      isLate = this.course.isLate;
    } else {
      throw new InternalServerErrorException('Event fee has no parent');
    }

    if (isLate && this.lateAmount) {
      return this.lateAmount;
    }

    return this.amount;
  }
}
