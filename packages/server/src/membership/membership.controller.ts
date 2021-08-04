import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Account } from '../account/account.entity';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Acc } from '@server/auth/decorators/account.decorator';
import { InvoiceDto } from './dto/invoice.dto';

@Controller('/membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @UserAuth()
  @Post()
  create(@Body() { users }: CreateMembershipDto, @Acc() account: Account) {
    return this.membershipService.create(users, account);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.membershipService.findOneOrFail(id);
  }

  @UserAuth()
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.membershipService.delete(id);
  }

  @UserAuth()
  @Post('/order/create/')
  createOrder(@Acc() account: Account, @Body() { users }: CreateMembershipDto) {
    return this.membershipService.createOrder(account, users);
  }

  @UserAuth()
  @Post('/order/capture/:invoiceId')
  captureOrder(@Param() { invoiceId }: InvoiceDto) {
    return this.membershipService.captureOrder(invoiceId);
  }

  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.membershipService.findAll(limit, offset);
  }
}
