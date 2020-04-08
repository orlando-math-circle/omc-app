import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Session,
} from '@nestjs/common';
import { Acc } from './decorators/account.decorator';
import { LocalGuard } from './guards/local.guard';
import { LoginGuard } from './guards/login.guard';

@Controller()
export class AuthController {
  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Acc() account: Account) {
    return account;
  }

  @UseGuards(LocalGuard)
  @Get('/me')
  getMe(@Acc() account: Account) {
    return account;
  }
}
