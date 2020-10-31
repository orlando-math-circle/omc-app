import { Controller, Delete, Get, Param } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':directory')
  getDirectory(@Param('directory') directory: string) {
    return this.fileService.getDirectory(directory);
  }

  @Get()
  getDirectories() {
    return this.fileService.getPathContents();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.fileService.delete(id);
  }
}
