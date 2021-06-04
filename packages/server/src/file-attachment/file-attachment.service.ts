import { EntityRepository, FilterQuery, Populate } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { FileFieldService } from '../file-fields/file-field.service';
import { File } from '../file/file.entity';
import { MulterFile } from '../file/interfaces/multer-file.interface';
import { User } from '../user/user.entity';
import { FileAttachment } from './file-attachment.entity';

@Injectable()
export class FileAttachmentService {
  constructor(
    @InjectRepository(FileAttachment)
    private readonly attachmentRepository: EntityRepository<FileAttachment>,
    private readonly fileFieldService: FileFieldService,
    private readonly config: ConfigService,
  ) {}

  async create(field: string, multerFile: MulterFile, user: User) {
    const attachment = this.attachmentRepository.create({
      field: await this.fileFieldService.findOneOrFail({
        name: field,
      }),
      user,
    });

    attachment.file = new File(multerFile, user);
    attachment.file.root = multerFile.path.replace(
      this.config.FILES.UPLOAD_DIRECTORY,
      '',
    );
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

  async delete(where: FilterQuery<FileAttachment>, scanUser?: User) {
    const attachment = await this.attachmentRepository.findOneOrFail(where, [
      'user',
      'file',
    ]);

    if (scanUser && attachment.user.id !== scanUser.id) {
      throw new ForbiddenException();
    }

    await this.attachmentRepository.remove(attachment).flush();
  }
}
