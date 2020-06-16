import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from 'mikro-orm';
import { Account } from '../accounts/account.entity';
import { Roles } from '../app.roles';

@Entity()
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  dob!: Date;

  @Property({ nullable: true, unique: true })
  email?: string;

  @Property({ nullable: true })
  emailVerified?: boolean;

  @Property({ nullable: true })
  password?: string;

  @Property()
  roles: Roles[] = [];

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  @ManyToOne(() => Account)
  account: Account;
}
