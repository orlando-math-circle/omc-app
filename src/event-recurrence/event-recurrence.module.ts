import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventRecurrence } from './event-recurrence.entity';
import { EventRecurrenceService } from './event-recurrence.service';

@Module({
  imports: [MikroOrmModule.forFeature([EventRecurrence])],
  controllers: [],
  providers: [EventRecurrenceService],
  exports: [EventRecurrenceService],
})
export class EventRecurrenceModule {}
