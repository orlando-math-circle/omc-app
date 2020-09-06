import { BaseEntity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Event } from '../event/event.entity';

export class Invoice extends BaseEntity<Invoice, 'id'> {
  @PrimaryKey({ serializedPrimaryKey: false })
  id!: string;

  @ManyToOne(() => Event)
  event!: Event;
}
