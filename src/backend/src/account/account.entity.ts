import {
  BaseEntity,
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from 'mikro-orm';
import { User } from '../user/user.entity';

@Entity()
export class Account extends BaseEntity<Account, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  logoutAt?: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Relationships
   */

  @OneToOne(() => User, null, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    owner: true,
  })
  primaryUser!: User;

  @OneToMany(() => User, (u) => u.account, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  users = new Collection<User>(this);
}
