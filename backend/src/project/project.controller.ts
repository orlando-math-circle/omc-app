import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';
import { FindProjectDto } from './dto/find-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get(':id')
  findOne(@Param() { id }: FindProjectDto) {
    return this.projectService.findOneOrFail(id);
  }

  @Get()
  findAll(@Query() { limit, offset, contains, orderBy }: FindAllProjectsDto) {
    return this.projectService.findAll(
      contains
        ? ({
            $or: [
              { 'lower(name)': { $like: `${contains}%` } },
              { 'lower(description)': { $like: `%${contains}%` } },
            ],
          } as any)
        : {},
      {},
      limit,
      offset,
      orderBy,
    );
  }

  @Patch(':id')
  update(
    @Param() { id }: FindProjectDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }
}
