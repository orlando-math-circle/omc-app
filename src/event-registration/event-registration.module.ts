import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventRegistrationService } from './event-registration.service';

@Module({
  imports: [MikroOrmModule.forFeature([])],
  controllers: [],
  providers: [EventRegistrationService],
  exports: [],
})
export class EventRegistrationModule {}
