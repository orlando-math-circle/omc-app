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
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { FindAllAccountsDto } from './dto/find-all-accounts.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  sayHello(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.accountService.findOne(id);
  }

  @Get()
  findAll(@Query() { take, skip }: FindAllAccountsDto) {
    return this.accountService.findAll(take, skip);
  }

  @Patch(':id')
  update(@Param() id: number, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete(':id')
  delete(@Param() id: number) {
    return this.accountService.delete(id);
  }
}
