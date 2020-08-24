import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import MikroORMConfig from '../mikro-orm.config';
import { AccountModule } from './account/account.module';
import ConfigSchema from './app.config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: ConfigSchema, isGlobal: true }),
    MikroOrmModule.forRoot(MikroORMConfig),
    EmailModule,
    AuthModule,
    AccountModule,
    UserModule,
    EventModule,
    // ProjectModule,
    // ProjectJobModule,
    // ProjectWorkModule,
  ],
})
export class AppModule {}
