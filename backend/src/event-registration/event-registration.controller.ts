import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { AccountAuth, UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CreateRegistrationDto } from './dtos/create-registration.dto';
import { CreateVolunteerRegistrationDto } from './dtos/create-volunteer-registration.dto';
import { FindAllRegistrationsDto } from './dtos/find-all-registrations.dto';
import { FindEventWithInvoiceDto } from './dtos/find-event-with-invoice.dto';
import { EventRegistrationService } from './event-registration.service';

@Controller('/registration')
export class EventRegistrationController {
  constructor(private readonly registrationService: EventRegistrationService) {}

  @UserAuth('event-registration', 'create:own')
  @Post()
  create(
    @Body() { eventId, users }: CreateRegistrationDto,
    @Usr() user: User,
    @Acc() account: Account,
  ) {
    return this.registrationService.create(eventId, users, user, account);
  }

  @UserAuth('volunteer-registration', 'create:own')
  @Post('/volunteer')
  volunteer(
    @Body() { eventId, users }: CreateVolunteerRegistrationDto,
    @Usr() user: User,
  ) {
    return this.registrationService.volunteer(eventId, users, user);
  }

  @UserAuth('event-registration', 'read:any')
  @Get()
  findAll(@Query() { limit, offset }: FindAllRegistrationsDto) {
    return this.registrationService.findAll(
      {
        volunteering: false,
      },
      ['event', 'user'],
      limit,
      offset,
    );
  }

  @UserAuth('volunteer-registration', 'read:any')
  @Get('/volunteering')
  findAllVolunteering(@Query() { limit, offset }: FindAllRegistrationsDto) {
    return this.registrationService.findAll(
      {
        volunteering: true,
      },
      ['event', 'user', 'job', 'work'],
      limit,
      offset,
    );
  }

  @AccountAuth()
  @Get('/status/:eventId')
  getStatus(@Param('eventId') eventId: number, @Acc() account: Account) {
    return this.registrationService.getRegistrationStatus(eventId, account);
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

  @UserAuth('event-registration', 'delete:own')
  @Delete(':id')
  delete(@Param('id') id: number, @Usr() user: User) {
    return this.registrationService.delete(id, user);
  }
}
