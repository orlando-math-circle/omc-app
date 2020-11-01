import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { File } from './file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature({ entities: [File] })],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
