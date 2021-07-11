import {
  BaseEntity,
  Entity,
  PrimaryKey,
  Property,
  Unique,
  Collection,
  OneToMany,
  OneToOne,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { Invoice } from '@server/invoice/invoice.entity';

@Entity()
//@Unique({ properties: ['user'] })
export class Membership extends BaseEntity<Membership, 'id'> {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => User, (user) => user.membership)
  user!: User;

  @Property({ nullable: true })
  startDate?: Date;

  @Property({ nullable: true })
  expitationDate?: Date;
}
