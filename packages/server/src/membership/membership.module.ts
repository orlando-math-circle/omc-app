import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PayPalModule } from '../paypal/paypal.module';
import { UserModule } from '../user/user.module';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Membership]),
    EventModule,
    InvoiceModule,
    PayPalModule,
    UserModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
