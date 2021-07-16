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
  private findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.attendanceService.findAll(limit, offset);
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
