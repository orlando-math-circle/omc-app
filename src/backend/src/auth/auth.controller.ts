import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Acc } from './decorators/account.decorator';
import { Auth } from './decorators/auth.decorator';
import { Usr } from './decorators/user.decorator';
import { ForgotPasswordDTO } from './dtos/forgot-password.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { VerifyTokenDTO } from './dtos/verify-token.dto';

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

  @Auth()
  @Post('logout')
  logout(@Acc() account: Account) {
    return this.authService.logout(account);
  }

  @Post('forgot')
  forgotPassword(@Body() { email }: ForgotPasswordDTO) {
    return this.authService.forgotPassword(email);
  }

  @Post('/verify/email')
  async verifyEmailToken(@Body() { token }: VerifyTokenDTO) {
    await this.authService.verifyEmail(token);
  }

  @Post('/verify/reset')
  async verifyResetToken(@Body() { token }: VerifyTokenDTO) {
    await this.authService.getValidResetTokenUser(token);
  }

  @Post('reset')
  resetPassword(@Body() { token, password }: ResetPasswordDTO) {
    return this.authService.resetUserPassword(token, password);
  }
}
