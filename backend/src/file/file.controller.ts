import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
