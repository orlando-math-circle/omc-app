import {
  ArrayType,
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from 'mikro-orm';
import { Account } from '../account/account.entity';
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

  @Property({ nullable: true, hidden: true })
  password?: string;

  @Property({ type: ArrayType })
  roles: Roles[] = [];

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
}
