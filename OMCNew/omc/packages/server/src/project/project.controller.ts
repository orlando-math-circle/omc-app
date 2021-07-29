import { FilterQuery } from '@mikro-orm/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';
import { FindProjectDto } from './dto/find-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';
import { ProjectService } from './project.service';

@Controller('/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UserAuth('project', 'create:any')
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get(':id')
  findOne(@Param() { id }: FindProjectDto) {
    return this.projectService.findOneOrFail(id, ['jobs', 'events']);
  }

  @Get()
  findAll(@Query() { limit, offset, contains, orderBy }: FindAllProjectsDto) {
    const where: FilterQuery<Project> = !contains
      ? {}
      : {
          $or: [
            { 'lower(id::text)': { $like: `%${contains}%` } },
            { 'lower(name)': { $like: `%${contains}%` } },
            { 'lower(description)': { $like: `%${contains}%` } },
          ],
        };

    return this.projectService.findAll(where, {}, limit, offset, orderBy);
  }

  @UserAuth('project', 'update:any')
  @Patch(':id')
  update(
    @Param() { id }: FindProjectDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @UserAuth('project', 'delete:any')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.projectService.delete(id);
  }
}
