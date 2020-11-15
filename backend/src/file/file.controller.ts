import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { User } from '../user/user.entity';
import { FileService } from './file.service';
import { FileInterceptor } from './interceptors/file.interceptor';
import { MulterFile } from './interfaces/multer-file.interface';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UserAuth('file', 'create:any')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', 'general', {
      fileSize: 10000000,
    }),
  )
  upload(@UploadedFile() file: MulterFile, @Usr() user: User) {
    return this.fileService.create(file, user);
  }

  @UserAuth('file', 'read:any')
  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.findOneOrFail(id);

    return res.download(file.path, file.originalName);
  }

  @UserAuth('file', 'read:any')
  @Get()
  getDirectories() {
    return this.fileService.getPathContents();
  }

  @UserAuth('file', 'read:any')
  @Get(':directory')
  getDirectory(@Param('directory') directory: string) {
    return this.fileService.getDirectory(directory);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.fileService.delete(id);
  }
}
