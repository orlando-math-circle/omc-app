import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Invoice } from '@server/invoice/invoice.entity';
import { User } from '../user/user.entity';

@Entity()
export class Membership extends BaseEntity<Membership, 'id'> {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  expiresOn: Date = new Date(Date.UTC(new Date().getUTCFullYear() + 1, 0, 1));

  @Property({ persist: false })
  get isActive() {
    return this.expiresOn > new Date();
  }

  @OneToOne(() => Invoice, (i) => i.membership, { nullable: true, owner: true })
  invoice!: Invoice;
}
