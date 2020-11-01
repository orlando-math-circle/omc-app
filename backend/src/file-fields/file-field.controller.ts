import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { CreateFileFieldDto } from './dto/create-file-field.dto';
import { FileFieldService } from './file-field.service';

@Controller('file-field')
export class FileFieldController {
  constructor(private readonly fileFieldService: FileFieldService) {}

  @UserAuth('file-field', 'create:any')
  @Post()
  create(@Body() createFileFieldDto: CreateFileFieldDto) {
    if (createFileFieldDto.name.indexOf(' ') >= 0) {
      throw new BadRequestException(
        'Spaces are not allowed in file field names',
      );
    }

    return this.fileFieldService.create(createFileFieldDto);
  }

  @UserAuth('file-field', 'read:any')
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.fileFieldService.findOneOrFail({ name });
  }
}
