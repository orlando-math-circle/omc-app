import { Injectable } from '@nestjs/common';
import { Project } from './project.entity';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  create({ name, description, hours }: CreateProjectDTO) {
    const project = new Project(name, description, hours);

    return project.save();
  }

  findOne(id: number) {
    return Project.findOneOrFail(id);
  }

  findAll(take: number = 20, skip: number = 0) {
    return Project.findAndCount({ take, skip });
  }

  async update(id: number, updateProjectDto: UpdateProjectDTO) {
    const project = await Project.findOneOrFail(id);

    Project.merge(project, updateProjectDto);

    return project.save();
  }

  async delete(id: number) {
    const project = await Project.findOneOrFail(id);

    return project.remove();
  }
}
