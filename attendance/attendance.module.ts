import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
import { UserModule } from '@server/user/user.module';
import { EventModule } from '@server/event/event.module';
import { VolunteerWorkModule } from '@server/volunteer-work/volunteer-work.module';
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
