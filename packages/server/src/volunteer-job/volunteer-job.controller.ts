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
import { CreateJobDto } from './dto/create-job.dto';
import { FindAllJobsDto } from './dto/find-all-jobs.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { VolunteerJobService } from './volunteer-job.service';

@Controller('volunteer-job')
export class VolunteerJobController {
  constructor(private readonly volunteerJobService: VolunteerJobService) {}

  @UserAuth('volunteer-job', 'create:any')
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.volunteerJobService.create(createJobDto);
  }

  @UserAuth('volunteer-job', 'read:any')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.volunteerJobService.findOneOrFail(id, ['project']);
  }

  @UserAuth('volunteer-job', 'read:any')
  @Get()
  findAll(@Query() { limit, offset, contains, orderBy }: FindAllJobsDto) {
    return this.volunteerJobService.findAll(
      contains
        ? ({
            $or: [
              { 'lower(id::text)': { $like: `%${contains}%` } },
              { 'lower(name)': { $like: `%${contains}%` } },
              { 'lower(description)': { $like: `%${contains}%` } },
              { 'lower(hours::text)': { $like: `%${contains}%` } },
            ],
          } as any)
        : {},
      ['project'],
      limit,
      offset,
      orderBy,
    );
  }

  @UserAuth('volunteer-job', 'update:any')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.volunteerJobService.update(id, updateJobDto);
  }

  @UserAuth('volunteer-job', 'delete:any')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.volunteerJobService.delete(id);
  }
}
