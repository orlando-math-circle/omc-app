import {
  ArrayType,
  BaseEntity,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Account } from '../account/account.entity';
import { Roles } from '../app.roles';
import { EventRegistration } from '../event-registration/event-registration.entity';
import { Invoice } from '../invoice/invoice.entity';

@Entity()
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  first!: string;

  @Property()
  last!: string;

  @Property()
  dob!: Date;

  @Property({ nullable: true, unique: true })
  email?: string;

  @Property({ nullable: true })
  emailVerified?: boolean;

  @Property({ nullable: true, hidden: true })
  password?: string;

  @Property({ type: ArrayType })
  roles: Roles[] = [];

  @Property({ nullable: true })
  feeWaived: boolean;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  // Intentionally hidden as serializing an account entity causes
  // a circular JSON structure when it reaches this property.
  @ManyToOne(() => Account, { hidden: true })
  account!: Account;

  @OneToMany(() => EventRegistration, (r) => r.user, { eager: false })
  registrations = new Collection<EventRegistration>(this);

  @OneToMany(() => Invoice, (i) => i.user, { eager: false })
  invoices = new Collection<Invoice>(this);
}
