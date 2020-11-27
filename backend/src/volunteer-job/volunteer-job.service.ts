import {
  EntityRepository,
  FilterQuery,
  Populate,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { VolunteerJob } from './volunteer-job.entity';

@Injectable()
export class VolunteerJobService {
  constructor(
    @InjectRepository(VolunteerJob)
    private readonly volunteerJobRepository: EntityRepository<VolunteerJob>,
  ) {}

  /**
   * Creates a new volunteer job for a specified project.
   *
   * @param createJobDto Entity data.
   */
  async create(createJobDto: CreateJobDto) {
    const job = this.volunteerJobRepository.create(createJobDto);

    await this.volunteerJobRepository.persist(job).flush();

    return job;
  }

  /**
   * Finds and paginates all volunteer jobs matching an optional query.
   *
   * @param where
   * @param populate
   * @param limit
   * @param offset
   * @param orderBy
   */
  async findAll<P extends Populate<VolunteerJob> = any>(
    where: FilterQuery<VolunteerJob>,
    populate?: P,
    limit?: number,
    offset?: number,
    orderBy?: QueryOrderMap,
  ) {
    return this.volunteerJobRepository.findAndCount(where, {
      populate,
      limit,
      offset,
      orderBy,
    });
  }
}
