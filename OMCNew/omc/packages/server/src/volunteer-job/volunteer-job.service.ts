import {
  EntityRepository,
  FilterQuery,
  Populate,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
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
   * Finds a single volunteer job by id.
   *
   * @param where Query for selecting the job
   * @param populate Relationships to load
   */
  async findOneOrFail<P extends Populate<VolunteerJob> = any>(
    where: FilterQuery<VolunteerJob>,
    populate?: P,
  ) {
    return this.volunteerJobRepository.findOneOrFail(where, populate);
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

  /**
   * Updates a single job.
   *
   * @param where Query for selecting the job
   * @param updateJobDto Properties to update in the job
   */
  async update(where: FilterQuery<VolunteerJob>, updateJobDto: UpdateJobDto) {
    const job = await this.volunteerJobRepository.findOneOrFail(where);

    job.assign(updateJobDto);

    await this.volunteerJobRepository.flush();

    return job;
  }

  /**
   * Deletes a job.
   *
   * @param where Query for selecting the job
   */
  async delete(where: FilterQuery<VolunteerJob>) {
    const job = await this.volunteerJobRepository.findOneOrFail(where, false);

    this.volunteerJobRepository.remove(job);

    await this.volunteerJobRepository.flush();
  }
}
