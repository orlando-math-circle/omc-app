import {
  BaseEntity,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EventRegistration } from '../event-registration/event-registration.entity';
import { Membership } from '../membership/membership.entity';
import { User } from '../user/user.entity';
import { InvoiceStatus } from './enums/invoice-status.enum';

@Entity()
export class Invoice extends BaseEntity<Invoice, 'id'> {
  @PrimaryKey()
  id!: string;

  @Enum(() => InvoiceStatus)
  status: InvoiceStatus = InvoiceStatus.STARTED;

  @Property()
  purchasedAt!: Date;

  @Property()
  gross!: string;

  @Property()
  amount!: string;

  @Property()
  net!: string;

  @OneToOne(() => Membership, (m) => m.invoice, { nullable: true })
  membership?: Membership;

  @OneToOne(() => EventRegistration, (e) => e.invoice, { nullable: true })
  registration?: EventRegistration;

  @ManyToOne(() => User, { eager: true })
  user!: User;
}
