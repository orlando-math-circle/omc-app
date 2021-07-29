import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileFieldModule } from '../file-fields/file-field.module';
import { FileAttachmentController } from './file-attachment.controller';
import { FileAttachment } from './file-attachment.entity';
import { FileAttachmentService } from './file-attachment.service';

@Module({
  imports: [MikroOrmModule.forFeature([FileAttachment]), FileFieldModule],
  providers: [FileAttachmentService],
  controllers: [FileAttachmentController],
  exports: [FileAttachmentService],
})
export class FileAttachmentModule {}
