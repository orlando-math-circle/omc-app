import { Module, Global } from '@nestjs/common';
import { AccountModule } from '../accounts/account.module';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { LoginGuard } from './guards/login.guard';
import { LocalStrategy } from './strategies/local.strategy';

@Global()
@Module({
  imports: [AccountModule],
  providers: [
    AuthService,
    AuthSerializer,
    LocalStrategy,
    LocalGuard,
    LoginGuard,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
