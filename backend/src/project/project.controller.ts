import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProjectDto } from './dtos/create-project.dto';
import { FindProjectDto } from './dtos/find-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
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

  @Patch(':id')
  update(
    @Param() { id }: FindProjectDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }
}
