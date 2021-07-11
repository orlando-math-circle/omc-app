import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import MikroORMConfig from '../mikro-orm.config';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { EmailModule } from './email/email.module';
import { EventRegistrationModule } from './event-registration/event-registration.module';
import { EventModule } from './event/event.module';
import { FileAttachmentModule } from './file-attachment/file-attachment.module';
import { FileFieldModule } from './file-fields/file-field.module';
import { FileModule } from './file/file.module';
import { PayPalModule } from './paypal/paypal.module';
import { ProjectModule } from './project/project.module';
import { SystemModule } from './system/system.module';
import { TwitterModule } from './twitter/twitter.module';
import { UserModule } from './user/user.module';
import { VolunteerJobModule } from './volunteer-job/volunteer-job.module';
import { VolunteerWorkModule } from './volunteer-work/volunteer-work.module';
import { ConfigModule } from './config/config.module';
import { configSchema } from './config/config.schema';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
    }),
    MikroOrmModule.forRoot(MikroORMConfig),
    EmailModule,
    AuthModule,
    AccountModule,
    UserModule,
    EventModule,
    EventRegistrationModule,
    PayPalModule,
    CourseModule,
    ProjectModule,
    TwitterModule,
    FileModule,
    FileFieldModule,
    FileAttachmentModule,
    SystemModule,
    VolunteerJobModule,
    VolunteerWorkModule,
    MembershipModule,
  ],
})
export class AppModule {}
