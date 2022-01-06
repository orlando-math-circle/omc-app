import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from './account/account.module';
import { ActivityRecordModule } from './activity-record/activity-record.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { configSchema } from './config/config.schema';
import { CourseModule } from './course/course.module';
import { EmailModule } from './email/email.module';
import { EventRegistrationModule } from './event-registration/event-registration.module';
import { EventModule } from './event/event.module';
import { FileAttachmentModule } from './file-attachment/file-attachment.module';
import { FileFieldModule } from './file-field/file-field.module';
import { FileModule } from './file/file.module';
import { MembershipModule } from './membership/membership.module';
import { PayPalModule } from './paypal/paypal.module';
import { ProjectModule } from './project/project.module';
import { SystemModule } from './system/system.module';
import { TwitterModule } from './twitter/twitter.module';
import { UserModule } from './user/user.module';
import { VolunteerJobModule } from './volunteer-job/volunteer-job.module';
import { VolunteerWorkModule } from './volunteer-work/volunteer-work.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
    }),
    MikroOrmModule.forRoot(),
    EmailModule,
    AuthModule,
    ActivityRecordModule,
    AccountModule,
    AttendanceModule,
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
    AttendanceModule,
  ],
})
export class AppModule {}
