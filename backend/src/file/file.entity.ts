import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { FileAttachment } from '../file-attachment/file-attachment.entity';
import { User } from '../user/user.entity';
import { MulterFile } from './interfaces/multer-file.interface';

@Entity()
export class File {
  constructor(file: MulterFile, user?: User) {
    this.name = file.filename;
    this.originalName = file.originalname;
    this.size = file.size;
    this.mimetype = file.mimetype;
    this.destination = file.destination;
    this.path = file.path;

    if (user) {
      this.author = user;
    }
  }

  @PrimaryKey()
  id: string = v4();

  @Property()
  name!: string;

  @Property()
  originalName!: string;

  @Property()
  size!: number;

  @Property()
  mimetype!: string;

  @Property()
  destination!: string;

  @Property()
  path!: string;

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  @ManyToOne(() => User, { eager: true })
  author!: User;

  @OneToOne(() => FileAttachment, null, { nullable: true })
  attachment?: FileAttachment;
}
