import {
  BaseEntity,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Course } from '../course/course.entity';
import { Event } from '../event/event.entity';
import { User } from '../user/user.entity';
import { InvoiceStatus } from './enums/invoice-status.enum';

@Entity()
export class Invoice extends BaseEntity<Invoice, 'id'> {
  @PrimaryKey()
  id!: string;

  @Enum(() => InvoiceStatus)
  status: InvoiceStatus = InvoiceStatus.STARTED;

  @Property()
  purchasedAt: Date;

  @Property()
  gross: string;

  @Property()
  fee: string;

  @Property()
  net: string;

  /**
   * Relationships
   */

  @ManyToOne(() => Event, { nullable: true })
  event?: Event;

  @ManyToOne(() => Course, { nullable: true })
  course?: Course;

  @ManyToOne(() => User, { eager: true })
  user!: User;
}
