import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from '../accounts/account.module';
import { ACCESS_CONTROL_TOKEN } from '../app.constants';
import AccessControl from '../app.roles';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const ACProvider = {
  provide: ACCESS_CONTROL_TOKEN,
  useValue: AccessControl,
};

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('SECRET'),
      }),
      imports: [ConfigModule],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AccountModule),
  ],
  providers: [AuthService, ACProvider],
  controllers: [AuthController],
  exports: [AuthService, ACProvider],
})
export class AuthModule {}
