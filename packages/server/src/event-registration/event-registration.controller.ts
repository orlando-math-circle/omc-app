import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '../account/account.entity';
import { isBoolean } from '../app.utils';
import { Acc } from '../auth/decorators/account.decorator';
import { AccountAuth, UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CreateRegistrationDto } from './dtos/create-registration.dto';
import { CreateVolunteerRegistrationDto } from './dtos/create-volunteer-registration.dto';
import { FindAllRegistrationsDto } from './dtos/find-all-registrations.dto';
import { FindEventWithInvoiceDto } from './dtos/find-event-with-invoice.dto';
import { UpdateOwnEventRegistrationDto } from './dtos/update-event-registration.dto';
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
  findAll(
    @Query()
    { limit, offset, volunteering, coverable }: FindAllRegistrationsDto,
  ) {
    return this.registrationService.findAll(
      {
        ...(isBoolean(volunteering) ? { volunteering } : {}),
        ...(isBoolean(coverable) ? { isCoverable: coverable } : {}),
      },
      {
        populate: true,
        limit,
        offset,
      },
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

  @UserAuth('event-registration', 'create:own')
  @Post('/order/capture/:eventId/:invoiceId')
  captureOrder(@Param() { eventId, invoiceId }: FindEventWithInvoiceDto) {
    return this.registrationService.captureOrder(invoiceId, eventId);
  }

  @Post('/swap/:id')
  @UserAuth('event-registration', 'create:own')
  swap(@Param('id') id: number, @Usr() user: User) {
    return this.registrationService.swap(id, user);
  }

  @UserAuth('event-registration', 'update:own')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOwnEventRegistrationDto: UpdateOwnEventRegistrationDto,
    @Usr() user: User,
  ) {
    return this.registrationService.update(
      id,
      updateOwnEventRegistrationDto,
      user,
    );
  }

  @UserAuth('event-registration', 'delete:own')
  @Delete(':id')
  delete(@Param('id') id: number, @Usr() user: User) {
    return this.registrationService.delete(id, user);
  }
}
