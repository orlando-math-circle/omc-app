import { EntityRepository, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Populate } from '../app.utils';
import { VolunteerJob } from '../volunteer-job/volunteer-job.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: EntityRepository<Project>,
  ) {}

  async create({ jobs, ...meta }: CreateProjectDto) {
    const project = this.projectRepository.create(meta);

    if (jobs) {
      for (const job of jobs) {
        project.jobs.add(
          new VolunteerJob(job.name, job.hours || 0, job.description),
        );
      }
    }

    await this.projectRepository.persist(project).flush();

    return project;
  }

  findOneOrFail(where: FilterQuery<Project>, populate?: Populate<Project>) {
    return this.projectRepository.findOneOrFail(where, populate);
  }

  findAll(
    where: FilterQuery<Project>,
    populate?: Populate<Project>,
    limit?: number,
    offset?: number,
    orderBy?: QueryOrderMap,
  ) {
    return this.projectRepository.findAndCount(where, {
      limit,
      offset,
      populate,
      orderBy,
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOneOrFail(id);

    project.assign(updateProjectDto);

    await this.projectRepository.flush();

    return project;
  }

  /**
   * Deletes a single project
   *
   * @param where Query for selecting the project
   */
  async delete(where: FilterQuery<Project>) {
    const project = await this.projectRepository.findOneOrFail(where, [
      'jobs',
      'courses',
    ]);

    await this.projectRepository.remove(project).flush();
  }
}
