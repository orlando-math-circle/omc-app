import {
  BaseEntity,
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';

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
}
