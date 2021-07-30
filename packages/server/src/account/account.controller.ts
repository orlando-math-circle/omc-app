import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Acc } from '../auth/decorators/account.decorator';
import { AccountAuth, UserAuth } from '../auth/decorators/auth.decorator';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { FindOneAccountDto } from './dto/find-one-account.dto';
import { RegisterAccountDto } from './dto/register.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UserAuth('account', 'create:any')
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterAccountDto) {
    return this.accountService.register(registerDto);
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
    return this.accountService.findOneOrFail({ users: { id } }, ['users']);
  }

  @UserAuth('account', 'delete:any')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.accountService.delete(id);
  }
}
