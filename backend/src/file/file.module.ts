import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { File } from './file.entity';
import { FileService } from './file.service';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([File])],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
