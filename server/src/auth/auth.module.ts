import { forwardRef, Global, Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { ACCESS_CONTROL_TOKEN } from '../app.constants';
import AccessControl from '../app.roles';
import { UserModule } from '../user/user.module';
import { AccessService } from './access.service';
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
  imports: [forwardRef(() => UserModule), forwardRef(() => AccountModule)],
  providers: [
    AuthService,
    AccessService,
    ACProvider,
    LocalStrategy,
    TokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, AccessService, ACProvider],
})
export class AuthModule {}
