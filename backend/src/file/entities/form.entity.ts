import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/user.entity';
import { FormStatus } from '../interfaces/form-status.enum';
import { File } from './file.entity';

@Entity()
export class Form {
  constructor(field: string) {
    this.field = field;
  }

  @PrimaryKey()
  id!: number;

  @Enum(() => FormStatus)
  status: FormStatus = FormStatus.PENDING;

  @Property({ unique: true })
  field!: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  @OneToOne(() => File, (f) => f.form)
  file!: File;

  @ManyToOne(() => User, { eager: true })
  author!: User;
}
