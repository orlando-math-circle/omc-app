import {
  BaseEntity,
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { InternalServerErrorException } from '@nestjs/common';
import { Course } from '../course/course.entity';
import { Event } from '../event/event.entity';
import { Invoice } from '../invoice/invoice.entity';
import { LateFeeMode } from './enums/late-fee-mode.enum';

@Entity()
export class EventFee extends BaseEntity<EventFee, 'id'> {
  constructor(data: {
    amount: string;
    lateMode: LateFeeMode;
    lateAmount?: string;
  }) {
    super();

    this.amount = data.amount;
    this.lateAmount = data.lateAmount;
    this.lateMode = data.lateMode;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  amount!: string;

  @Property({ nullable: true })
  lateAmount?: string;

  @Enum(() => LateFeeMode)
  lateMode!: LateFeeMode;

  @OneToOne(() => Event, (e) => e.fee, { nullable: true })
  event?: Event;

  @OneToOne(() => Course, (c) => c.fee, { nullable: true })
  course?: Course;

  @OneToMany(() => Invoice, (i) => i.fee)
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

    if (!isLate) return this.amount;

    switch (this.lateMode) {
      case LateFeeMode.DEFAULT:
        return this.amount;
      case LateFeeMode.LATEFEE:
        return this.lateAmount;
      default:
        throw new InternalServerErrorException(
          `Unexpected late fee mode ${this.lateMode}`,
        );
    }
  }
}
