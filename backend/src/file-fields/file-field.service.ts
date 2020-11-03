import { EntityRepository, FilterQuery, Populate } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { REDUCED_LUNCH_FIELD } from '../app.constants';
import { CreateFileFieldDto } from './dto/create-file-field.dto';
import { FileField } from './file-field.entity';

@Injectable()
export class FileFieldService implements OnModuleInit {
  private readonly logger = new Logger(FileFieldService.name);

  constructor(
    @InjectRepository(FileField)
    private readonly fileFieldRepository: EntityRepository<FileField>,
  ) {}

  async create(createFileFieldDto: CreateFileFieldDto) {
    const fileField = this.fileFieldRepository.create(createFileFieldDto);

    await this.fileFieldRepository.persist(fileField).flush();

    return fileField;
  }

  async findOneOrFail<P extends Populate<FileField> = any>(
    where: FilterQuery<FileField>,
    populate?: P,
  ) {
    return this.fileFieldRepository.findOneOrFail(where, populate);
  }

  async findAndCount<P extends Populate<FileField> = any>(
    where: FilterQuery<FileField> = {},
    populate?: P,
  ) {
    return this.fileFieldRepository.findAndCount(where, populate);
  }

  async onModuleInit() {
    let reducedLunchFormField = await this.fileFieldRepository.findOne({
      name: REDUCED_LUNCH_FIELD,
    });

    if (!reducedLunchFormField) {
      this.logger.log('Seeding reduced lunch field...');

      reducedLunchFormField = this.fileFieldRepository.create({
        name: REDUCED_LUNCH_FIELD,
        fileSizeLimit: 15000000, // 15 MB limit.
        fileCountLimit: 1,
        fileExtensions: ['pdf', 'docx', 'doc', 'jpeg', 'jpg', 'png'],
      });

      await this.fileFieldRepository.persist(reducedLunchFormField).flush();
    }
  }
}
