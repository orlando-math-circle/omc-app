import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Acc } from '../auth/decorators/account.decorator';
import { AccountAuth, UserAuth } from '../auth/decorators/auth.decorator';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { FindOneAccountDto } from './dtos/find-one-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @AccountAuth()
  @Get('me')
  getMe(@Acc() account: Account) {
    return account;
  }

  @UserAuth('account', 'read:any')
  @Get(':id')
  findOne(@Param() { id }: FindOneAccountDto) {
    return this.accountService.findOneOrFail(id);
  }

  @UserAuth('account', 'read:any')
  @Get('/user/:id')
  findByUser(@Param('id') id: number) {
    return this.accountService.findOneOrFail({ primaryUser: { id } });
  }

  @UserAuth('account', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindOneAccountDto) {
    return this.accountService.delete(id);
  }
}
