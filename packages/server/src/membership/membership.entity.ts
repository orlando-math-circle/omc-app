import {
  BaseEntity,
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  Collection,
  OneToMany,
  ManyToMany,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { Invoice } from '@server/invoice/invoice.entity';

@Entity()
export class Membership extends BaseEntity<Membership, 'id'> {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => User, (user) => user.membership)
  user!: User;

  @Property()
  startDate: Date = new Date();

  @Property()
  expirationDate: Date = expirationDate(new Date());

  @Property({ persist: false })
  get active() {
    if (!this.expirationDate) return typeof this.expirationDate;
    const now = new Date();
    return this.expirationDate > now ? true : false;
  }

  @ManyToMany({
    entity: () => Invoice,
    owner: true,
    nullable: true,
  })
  invoices = new Collection<Invoice>(this);
}

function expirationDate(date: Date): Date {
  date.setMonth(0); // january
  date.setDate(1); // first
  date.setFullYear(date.getFullYear() + 1); // next Year

  return date;
}
