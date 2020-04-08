import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from '../auth/guards/local.guard';
import { CreateProjectDTO } from './dto/create-project.dto';
import { FindProjectDTO } from './dto/find-project.dto';
import { FindProjectsDTO } from './dto/find-projects.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDTO) {
    return this.projectService.create(createProjectDto);
  }

  @Get(':id')
  findOne(@Param() { id }: FindProjectDTO) {
    return this.projectService.findOne(id);
  }

  @Get()
  findAll(@Query() { take, skip }: FindProjectsDTO) {
    return this.projectService.findAll(take, skip);
  }

  @UseGuards(LocalGuard)
  @Patch(':id')
  update(
    @Param() { id }: FindProjectDTO,
    @Body() updateProjectDto: UpdateProjectDTO,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  delete(@Param() { id }: FindProjectDTO) {
    return this.projectService.delete(id);
  }
}
