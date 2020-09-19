import { Body, Controller, Param, Post } from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { FindEventWithInvoiceDto } from './dtos/find-event-with-invoice.dto';
import { EventRegistrationService } from './event-registration.service';

@Controller('/registration')
export class EventRegistrationController {
  constructor(private readonly registrationService: EventRegistrationService) {}

  @UserAuth('event-registration', 'create:own')
  @Post(':eventId/:invoiceId')
  create(
    @Param() { eventId, invoiceId }: FindEventWithInvoiceDto,
    @Usr() user: User,
  ) {
    return this.registrationService.create(eventId, invoiceId, user);
  }

  @UserAuth('event-registration', 'create:own')
  @Post('/order/create/:id')
  createOrder(
    @Param('id') id: number,
    @Acc() account: Account,
    @Body() { users }: CreateOrderDto,
  ) {
    return this.registrationService.createOrder(id, account, users);
  }

  // @UserAuth('event-registration', 'create:own')
  @Post('/order/capture/:eventId/:invoiceId')
  captureOrder(@Param() { eventId, invoiceId }: FindEventWithInvoiceDto) {
    return this.registrationService.captureOrder(invoiceId, eventId);
  }
}
