import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../accounts/account.entity';
import { AccountService } from '../accounts/account.service';
import { CreateAccountDTO } from '../accounts/dtos/create-account.dto';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Acc } from './decorators/account.decorator';
import { Auth } from './decorators/auth.decorator';
import { Usr } from './decorators/user.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Acc() account: Account, @Usr() user: User) {
    return this.authService.login(account, user);
  }

  @Post('register')
  register(@Body() createAccountDTO: CreateAccountDTO) {
    return this.accountService.create(createAccountDTO);
  }

  @Auth()
  @Post('logout')
  logout(@Acc() account: Account) {
    return this.authService.logout(account);
  }

  @Post('verify')
  verify(@Param('token') token: string) {
    return this.authService.verify(token);
  }
}
