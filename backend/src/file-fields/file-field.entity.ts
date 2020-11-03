import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import multer from 'multer';
import { extname } from 'path';
import { FileAttachment } from '../file-attachment/file-attachment.entity';

@Entity()
export class FileField extends BaseEntity<FileField, 'name'> {
  @PrimaryKey()
  name!: string;

  @Property()
  fileSizeLimit!: number;

  @Property()
  fileCountLimit!: number;

  @Property({ nullable: true })
  fileExtensions?: string[];

  @Property({ nullable: true })
  folder?: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  @OneToMany(() => FileAttachment, (fa) => fa.field)
  attachments = new Collection<FileAttachment>(this);

  /**
   * Rejects or approves the file upload based on its size and extension.
   */
  fileFilter: multer.Options['fileFilter'] = (
    _req,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    console.log(`File Size: ${file.size}, Limit: ${this.fileCountLimit}`);
    if (file.size > this.fileCountLimit) {
      callback(new BadRequestException('File is too large.'));
    }

    const extension = extname(file.originalname);

    if (this.fileExtensions && !this.fileExtensions.includes(extension)) {
      callback(
        new BadRequestException(
          `File extension ${extension} is not permitted.`,
        ),
      );
    }

    callback(null, true);
  };
}
