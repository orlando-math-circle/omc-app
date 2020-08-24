import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventRecurrence } from '../event-recurrence/event-recurrence.entity';
import { EventRecurrenceModule } from '../event-recurrence/event-recurrence.module';
import { EventController } from './event.controller';
import { Event } from './event.entity';
import { EventService } from './event.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Event, EventRecurrence]),
    EventRecurrenceModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
