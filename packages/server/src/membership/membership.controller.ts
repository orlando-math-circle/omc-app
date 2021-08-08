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
import { isBoolean } from 'lodash';

@Controller('/membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  @UserAuth('membership', 'create:any')
  create(@Body() { userIds }: CreateMembershipDto) {
    return this.membershipService.create(userIds);
  }

  @Get('/statuses')
  @UserAuth()
  getMembershipStatuses(@Acc() account: Account) {
    return this.membershipService.getMembershipStatuses(account);
  }

  @Get()
  @UserAuth()
  findAll(
    @Acc() account: Account,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('account') byAccount?: boolean,
    @Query('active') active?: boolean,
  ) {
    return this.membershipService.findAll(
      {
        ...(isBoolean(byAccount) && byAccount
          ? {
              user: { id: { $in: account.users.getIdentifiers() as number[] } },
            }
          : {}),
        ...(isBoolean(active) && active
          ? { expiresOn: { $gt: new Date() } }
          : {}),
      },
      { limit, offset, populate: ['user'] },
    );
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

  @Post('/order/create/')
  @UserAuth('membership', 'create:own', { verified: true })
  createOrder(
    @Acc() account: Account,
    @Body() { userIds }: CreateMembershipDto,
  ) {
    return this.membershipService.createOrder(account, userIds);
  }

  @UserAuth('membership', 'create:own', { verified: true })
  @Post('/order/capture/:orderId')
  captureOrder(@Param('orderId') orderId: string) {
    return this.membershipService.captureOrder(orderId);
  }
}
