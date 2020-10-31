import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from '../../user/user.entity';
import { MulterFile } from '../interfaces/multer-file.interface';
import { Form } from './form.entity';

@Entity()
export class File {
  constructor(file: MulterFile) {
    this.name = file.filename;
    this.originalName = file.originalname;
    this.size = file.size;
    this.mimetype = file.mimetype;
    this.destination = file.destination;
    this.path = file.path;
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

  @OneToOne(() => Form, null, { nullable: true })
  form?: Form;
}
