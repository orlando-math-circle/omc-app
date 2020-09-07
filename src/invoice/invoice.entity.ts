import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Event } from '../event/event.entity';

@Entity()
export class Invoice extends BaseEntity<Invoice, 'id'> {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Event)
  event!: Event;

  @Property()
  purchasedAt: Date;

  @Property()
  gross: string;

  @Property()
  fee: string;

  @Property()
  net: string;
}
