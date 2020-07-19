import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/account.entity';
import { FindUserDto } from '../user/dtos/find-user.dto';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Acc } from './decorators/account.decorator';
import { AccountAuth } from './decorators/auth.decorator';
import { Usr } from './decorators/user.decorator';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyTokenDto } from './dtos/verify-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Acc() account: Account, @Usr() user: User) {
    return this.authService.login(account, user);
  }

  @AccountAuth()
  @Post('logout')
  logout(@Acc() account: Account) {
    return this.authService.logout(account);
  }

  @AccountAuth()
  @Post('switch/:id')
  switch(@Acc() account: Account, @Param() { id }: FindUserDto) {
    return this.authService.switchUser(account, id);
  }

  @Post('forgot')
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('/verify/email')
  async verifyEmailToken(@Body() { token }: VerifyTokenDto) {
    await this.authService.verifyEmail(token);
  }

  @Post('/verify/reset')
  async verifyResetToken(@Body() { token }: VerifyTokenDto) {
    await this.authService.getValidResetTokenUser(token);
  }

  @Post('reset')
  resetPassword(@Body() { token, password }: ResetPasswordDto) {
    return this.authService.resetUserPassword(token, password);
  }
}
