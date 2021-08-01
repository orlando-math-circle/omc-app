import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { VolunteerWorkModule } from '../volunteer-work/volunteer-work.module';
import { SqlEntityRepository } from '@mikro-orm/knex';

@Module({
  imports: [
    MikroOrmModule.forFeature([Attendance]),
    UserModule,
    EventModule,
    VolunteerWorkModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, SqlEntityRepository],
  exports: [AttendanceService],
})
export class AttendanceModule {}
