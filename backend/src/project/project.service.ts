import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: EntityRepository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectRepository.create(createProjectDto);

    await this.projectRepository.persist(project).flush();

    return project;
  }

  findOneOrFail(where: FilterQuery<Project>) {
    return this.projectRepository.findOneOrFail(where);
  }

  findAll(where: FilterQuery<Project>, limit: number, offset: number) {
    return this.projectRepository.findAndCount(where, {}, {}, limit, offset);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOneOrFail(id);

    project.assign(updateProjectDto);

    await this.projectRepository.flush();

    return project;
  }

  // async delete(id: number, )
}
