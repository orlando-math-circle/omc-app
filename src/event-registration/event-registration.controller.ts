import { Controller, Param, Post } from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { FindEventDto } from '../event/dtos/find-one-event.dto';
import { User } from '../user/user.entity';
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
  createOrder(@Param() { id }: FindEventDto, @Usr() user: User) {
    return this.registrationService.createOrder(id, user);
  }

  @UserAuth('event-registration', 'create:own')
  @Post('/order/capture/:eventId/:invoiceId')
  captureOrder(
    @Param() { eventId, invoiceId }: FindEventWithInvoiceDto,
    @Usr() user: User,
  ) {
    return this.registrationService.captureOrder(invoiceId, eventId, user);
  }
}
