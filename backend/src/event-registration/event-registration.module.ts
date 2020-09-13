import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PayPalModule } from '../paypal/paypal.module';
import { EventRegistrationController } from './event-registration.controller';
import { EventRegistration } from './event-registration.entity';
import { EventRegistrationService } from './event-registration.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([EventRegistration]),
    EventModule,
    InvoiceModule,
    PayPalModule,
  ],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
  exports: [EventRegistrationService],
})
export class EventRegistrationModule {}
