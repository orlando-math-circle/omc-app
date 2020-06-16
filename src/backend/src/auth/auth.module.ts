import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from '../accounts/account.module';
import { ACCESS_CONTROL_TOKEN } from '../app.constants';
import AccessControl from '../app.roles';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenStrategy } from './strategies/token.strategy';

const ACProvider = {
  provide: ACCESS_CONTROL_TOKEN,
  useValue: AccessControl,
};

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('SECRET'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AccountModule),
  ],
  providers: [AuthService, ACProvider, LocalStrategy, TokenStrategy],
  controllers: [AuthController],
  exports: [AuthService, ACProvider],
})
export class AuthModule {}
