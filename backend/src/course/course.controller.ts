import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Controller('/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UserAuth('course', 'create:any')
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOneOrFail(id);
  }

  @UserAuth('course', 'update:any')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @UserAuth('course', 'delete:any')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.courseService.delete(id);
  }
}
