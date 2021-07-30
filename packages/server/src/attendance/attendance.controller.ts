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
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dtos/mark-attendance.dto';
import { UpdateAttendanceDto } from './dtos/update-attendance.dto';
import { FindAllAttendancesDto } from './dtos/find-all-attendances.dto';
import { Usr } from '@server/auth/decorators/user.decorator';
import { User } from '@server/user/user.entity';
import { UserAuth } from '@server/auth/decorators/auth.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  private create(@Body() markAttendanceDTO: MarkAttendanceDto) {
    return this.attendanceService.create(markAttendanceDTO);
  }

  @Get(':id')
  private findOne(@Param('id') id: number) {
    return this.attendanceService.findOne(id);
  }

  @Get()
  private findAll(@Query() { limit, offset }: FindAllAttendancesDto) {
    return this.attendanceService.findAll(
      {},
      {
        //populate: ['user'],
        limit,
        offset,
      },
    );
  }

  @UserAuth()
  @Get('/status/:eventId')
  getStatus(@Param('eventId') eventId: number, @Usr() user: User) {
    return this.attendanceService.getAttendanceStatus(eventId, user);
  }

  @Patch(':id')
  private update(
    @Param('id') id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  private delete(@Param('id') id: number) {
    return this.attendanceService.destroy(id);
  }
}
