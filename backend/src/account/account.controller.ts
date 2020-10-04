import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Acc } from '../auth/decorators/account.decorator';
import { AccountAuth, UserAuth } from '../auth/decorators/auth.decorator';
import { UserValidationPipe } from '../user/pipe/user-validator.pipe';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { FindOneAccountDto } from './dtos/find-one-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UsePipes(new UserValidationPipe())
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

  @UserAuth('account', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindOneAccountDto) {
    return this.accountService.delete(id);
  }
}
