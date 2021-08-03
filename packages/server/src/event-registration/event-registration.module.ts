import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuditLogModule } from '@server/audit-log/audit-log.module';
import { EventModule } from '../event/event.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PayPalModule } from '../paypal/paypal.module';
import { UserModule } from '../user/user.module';
import { EventRegistrationController } from './event-registration.controller';
import { EventRegistration } from './event-registration.entity';
import { EventRegistrationService } from './event-registration.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([EventRegistration]),
    AuditLogModule,
    EventModule,
    InvoiceModule,
    PayPalModule,
    UserModule,
  ],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
  exports: [EventRegistrationService],
})
export class EventRegistrationModule {}
