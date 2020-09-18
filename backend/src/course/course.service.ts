import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Course } from './course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: EntityRepository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);

    await this.courseRepository.persist(course).flush();

    return course;
  }

  findOneOrFail(where: FilterQuery<Course>) {
    return this.courseRepository.findOneOrFail(where, ['events']);
  }

  findAll(where: FilterQuery<Course>, limit: number, offset: number) {
    return this.courseRepository.findAndCount(where, ['events'], {
      limit,
      offset,
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOneOrFail(id);

    course.assign(updateCourseDto);

    await this.courseRepository.flush();

    return course;
  }

  async delete(id: number) {
    const course = await this.courseRepository.findOneOrFail(id);

    return this.courseRepository.remove(course).flush();
  }
}
