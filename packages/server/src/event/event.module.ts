import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CourseModule } from '../course/course.module';
import { EventRecurrence } from './event-recurrence.entity';
import { EventController } from './event.controller';
import { Event } from './event.entity';
import { EventService } from './event.service';

@Module({
  imports: [MikroOrmModule.forFeature([Event, EventRecurrence]), CourseModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
