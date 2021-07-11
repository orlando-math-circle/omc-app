import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Account } from '../account/account.entity';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Acc } from '@server/auth/decorators/account.decorator';

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
}
