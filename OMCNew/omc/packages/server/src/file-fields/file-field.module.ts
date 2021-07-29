import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileFieldController } from './file-field.controller';
import { FileField } from './file-field.entity';
import { FileFieldService } from './file-field.service';

@Module({
  imports: [MikroOrmModule.forFeature([FileField])],
  providers: [FileFieldService],
  controllers: [FileFieldController],
  exports: [FileFieldService],
})
export class FileFieldModule {}
