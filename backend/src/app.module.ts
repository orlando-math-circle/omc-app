import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import MikroORMConfig from '../mikro-orm.config';
import { AccountModule } from './account/account.module';
import ConfigSchema from './app.config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventRegistrationModule } from './event-registration/event-registration.module';
import { EventModule } from './event/event.module';
import { PayPalModule } from './paypal/paypal.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ConfigSchema,
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MikroOrmModule.forRoot(MikroORMConfig),
    EmailModule,
    AuthModule,
    AccountModule,
    UserModule,
    EventModule,
    EventRegistrationModule,
    PayPalModule,
  ],
})
export class AppModule {}
