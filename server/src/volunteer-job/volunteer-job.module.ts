import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { VolunteerJobController } from './volunteer-job.controller';
import { VolunteerJob } from './volunteer-job.entity';
import { VolunteerJobService } from './volunteer-job.service';

@Module({
  imports: [MikroOrmModule.forFeature([VolunteerJob])],
  providers: [VolunteerJobService],
  controllers: [VolunteerJobController],
  exports: [VolunteerJobService],
})
export class VolunteerJobModule {}
