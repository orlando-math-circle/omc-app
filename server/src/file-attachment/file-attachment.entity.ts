import {
  BaseEntity,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { FileField } from '../file-fields/file-field.entity';
import { File } from '../file/file.entity';
import { ApprovalStatus } from '../file/interfaces/approval-status.enum';
import { User } from '../user/user.entity';

@Entity()
export class FileAttachment extends BaseEntity<FileAttachment, 'id'> {
  @PrimaryKey()
  id!: number;

  @Enum(() => ApprovalStatus)
  status: ApprovalStatus = ApprovalStatus.PENDING;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  @ManyToOne(() => FileField)
  field!: FileField;

  @OneToOne(() => File, (f) => f.attachment)
  file!: File;

  @ManyToOne(() => User)
  user!: User;
}
