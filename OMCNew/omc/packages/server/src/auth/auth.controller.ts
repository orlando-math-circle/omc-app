import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/account.entity';
import { FindUserDto } from '../user/dtos/find-user.dto';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Acc } from './decorators/account.decorator';
import { AccountAuth, UserAuth } from './decorators/auth.decorator';
import { Usr } from './decorators/user.decorator';
import { ChangeEmailDto } from './dtos/change-email.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
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

  @UserAuth()
  @Post('/verify/resend')
  async verifyEmailResend(@Usr() user: User) {
    return this.authService.resendVerifyEmail(user);
  }

  @Post('/verify/email')
  async verifyEmailToken(@Body() { token }: VerifyTokenDto) {
    await this.authService.verifyEmail(token);
  }

  @Post('/verify/reset')
  async verifyResetToken(@Body() { token }: VerifyTokenDto) {
    await this.authService.getValidResetTokenUser(token);
  }

  @UserAuth()
  @Post('/verify/email-change')
  private async verifyEmailChange(
    @Usr() user: User,
    @Body() { token }: VerifyTokenDto,
  ) {
    return this.authService.verifyEmailChange(user, token);
  }

  @UserAuth()
  @Post('/email/change')
  private async requestEmailChange(
    @Usr() user: User,
    @Body() { email }: ChangeEmailDto,
  ) {
    return this.authService.requestEmailChange(user, email);
  }

  @UserAuth()
  @Post('/password/change')
  async changePassword(
    @Acc() account: Account,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordDto, account);
  }

  @Post('/password/forgot')
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('/password/reset')
  resetPassword(@Body() { token, password }: ResetPasswordDto) {
    return this.authService.resetPassword(token, password);
  }
}
