import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Acc } from '../auth/decorators/account.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDTO } from './dtos/create-account.dto';
import { FindOneAccountDTO } from './dtos/find-one-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  create(@Body() createAccountDTO: CreateAccountDTO) {
    return this.accountService.create(createAccountDTO);
  }

  @Auth()
  @Get('me')
  getMe(@Acc() account: Account) {
    return account;
  }

  @Auth('account', 'read:any')
  @Get(':id')
  findOne(@Param() { id }: FindOneAccountDTO) {
    return this.accountService.findOneOrFail(id);
  }

  @Auth('account', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindOneAccountDTO) {
    return this.accountService.delete(id);
  }
}
