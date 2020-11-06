import { EntityRepository, FilterQuery, Populate } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FileFieldService } from '../file-fields/file-field.service';
import { File } from '../file/file.entity';
import { FileService } from '../file/file.service';
import { MulterFile } from '../file/interfaces/multer-file.interface';
import { User } from '../user/user.entity';
import { FileAttachment } from './file-attachment.entity';

@Injectable()
export class FileAttachmentService {
  constructor(
    @InjectRepository(FileAttachment)
    private readonly attachmentRepository: EntityRepository<FileAttachment>,
    private readonly fileFieldService: FileFieldService,
    private readonly fileService: FileService,
  ) {}

  async create(field: string, multerFile: MulterFile, user: User) {
    const attachment = this.attachmentRepository.create({
      field: await this.fileFieldService.findOneOrFail({
        name: field,
      }),
      file: new File(multerFile, user),
      user,
    });

    attachment.user.populated();
    attachment.file.populated();

    await this.attachmentRepository.persist(attachment).flush();

    return attachment;
  }

  findOneOrFail<P extends Populate<FileAttachment> = any>(
    where: FilterQuery<FileAttachment>,
    populate?: P,
  ) {
    return this.attachmentRepository.findOneOrFail(where, populate);
  }

  findAll<P extends Populate<FileAttachment> = any>(
    where: FilterQuery<FileAttachment>,
    populate?: P,
  ) {
    return this.attachmentRepository.find(where, { populate });
  }
}
