import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { VolunteerWorkController } from './volunteer-work.controller';
import { VolunteerWork } from './volunteer-work.entity';
import { VolunteerWorkService } from './volunteer-work.service';

@Module({
  imports: [MikroOrmModule.forFeature([VolunteerWork])],
  providers: [VolunteerWorkService],
  controllers: [VolunteerWorkController],
  exports: [VolunteerWorkService],
})
export class VolunteerWorkModule {}
