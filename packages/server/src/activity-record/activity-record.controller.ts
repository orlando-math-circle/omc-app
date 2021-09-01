import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { ActivityRecordService } from './activity-record.service';

@Controller('/activity-record')
export class ActivityRecordController {
  constructor(private readonly activityRecordService: ActivityRecordService) {}

  @Get(':id')
  @UserAuth('activity-record', 'read:any')
  findOne(@Param('id') id: number) {
    return this.activityRecordService.findOne(id);
  }

  @Get()
  @UserAuth('activity-record', 'read:any')
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.activityRecordService.findAll({}, { limit, offset });
  }
}
