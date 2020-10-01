import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SortingPipe } from '../shared/pipes/project-sort.pipe';
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
  @UsePipes(new SortingPipe())
  findAll(@Query() { search, limit, offset, orderBy }: FindAllProjectsDto) {
    const text =
      search && search !== '' ? search.trim().toLowerCase() : undefined;

    return this.projectService.findAll(
      text
        ? ({
            $or: [
              { 'lower(name)': { $like: `${text}%` } },
              { 'lower(description)': { $like: `%${text}%` } },
            ],
          } as any)
        : {},
      {},
      orderBy,
      limit,
      offset,
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
