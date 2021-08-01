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

  @Property({ nullable: true })
  startDate?: Date;

  @Property({ nullable: true })
  expitationDate?: Date;

  @Property({ persist: false, nullable: true })
  get active() {
    if (!this.expitationDate) return null;
    const now = new Date();
    return this.expitationDate > now ? true : false;
  }

  @ManyToMany({
    entity: () => Invoice,
    owner: true,
    nullable: true,
  })
  invoices = new Collection<Invoice>(this);
}
