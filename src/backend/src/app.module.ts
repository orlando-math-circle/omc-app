import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import MikroORMConfig from '../mikro-orm.config';
import { AccountModule } from './accounts/account.module';
import ConfigSchema from './app.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: ConfigSchema, isGlobal: true }),
    MikroOrmModule.forRoot(MikroORMConfig),
    AuthModule,
    AccountModule,
    UserModule,
  ],
})
export class AppModule {}
