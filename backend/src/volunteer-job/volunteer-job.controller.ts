import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { CreateJobDto } from './dto/create-job.dto';
import { FindAllJobsDto } from './dto/find-all-jobs.dto';
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
}
