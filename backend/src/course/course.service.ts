import { EntityRepository, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Populate, PopulateFail } from '../app.utils';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: EntityRepository<Course>,
  ) {}

  /**
   * Creates a new course for a project.
   *
   * @param createCourseDto CreateCourseDto
   */
  async create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);

    await this.courseRepository.persist(course).flush();

    return course;
  }

  /**
   * Retrieves a single course if possible or returns a 404 Not Found
   * exception. This method supports proxied MikroORM lookup features.
   *
   * @param where Id or query for selecting the entity.
   * @param populate Boolean or query for populating the entity.
   * @param orderBy Query for ordering by entity properties.
   */
  findOneOrFail(
    where: FilterQuery<Course>,
    orderBy?: QueryOrderMap,
    populate?: PopulateFail<Course>,
  ) {
    return this.courseRepository.findOneOrFail(where, populate, orderBy);
  }

  /**
   * Retrieves all courses given the specified query and pagination.
   * This method supports proxied MikroORM lookup features.
   *
   * @param where Query for selecting the entities.
   * @param limit Optional total number of entities to retrieve.
   * @param offset Optional number of entities to skip.
   * @param populate Boolean or query for populating the entity.
   * @param orderBy Query for ordering by entity properties.
   */
  findAll(
    where: FilterQuery<Course>,
    limit?: number,
    offset?: number,
    orderBy?: QueryOrderMap,
    populate?: Populate<Course>,
  ) {
    return this.courseRepository.findAndCount(where, {
      populate,
      limit,
      offset,
      orderBy,
    });
  }

  /**
   * Updates a course and replaces the specified data, if found,
   * or throws a 404 Not Found exception.
   *
   *
   * @param id Course ID.
   * @param updateCourseDto UpdateCourseDto of properties to modify.
   */
  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOneOrFail(id);

    course.assign(updateCourseDto);

    await this.courseRepository.flush();

    return course;
  }

  /**
   * Deletes a course, if found, or throws a 404 Not Found Exception.
   *
   * @param id Course ID.
   */
  async delete(id: number) {
    const course = await this.courseRepository.findOneOrFail(id);

    return this.courseRepository.remove(course).flush();
  }
}
