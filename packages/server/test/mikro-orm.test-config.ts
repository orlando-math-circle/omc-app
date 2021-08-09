import { BaseEntity, Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { NotFoundException } from '@nestjs/common';
import { Account } from '../src/account/account.entity';
import { Attendance } from '../src/attendance/attendance.entity';
import { AuditLog } from '../src/audit-log/audit-log.entity';
import { Course } from '../src/course/course.entity';
import { EventFee } from '../src/event-fee/event-fee.entity';
import { EventRegistration } from '../src/event-registration/event-registration.entity';
import { EventRecurrence } from '../src/event/event-recurrence.entity';
import { Event } from '../src/event/event.entity';
import { FileAttachment } from '../src/file-attachment/file-attachment.entity';
import { FileField } from '../src/file-fields/file-field.entity';
import { File } from '../src/file/file.entity';
import { Invoice } from '../src/invoice/invoice.entity';
import { Membership } from '../src/membership/membership.entity';
import { Project } from '../src/project/project.entity';
import { User } from '../src/user/user.entity';
import { VolunteerJob } from '../src/volunteer-job/volunteer-job.entity';
import { VolunteerWork } from '../src/volunteer-work/volunteer-work.entity';

export const MikroORMTestingConfig: Options = {
  type: 'postgresql',
  entities: [
    BaseEntity,
    AuditLog,
    Account,
    User,
    Event,
    EventFee,
    EventRecurrence,
    EventRegistration,
    Attendance,
    Membership,
    Invoice,
    Course,
    Project,
    File,
    FileAttachment,
    FileField,
    VolunteerJob,
    VolunteerWork,
  ],
  dbName: process.env.TESTING_DATABASE_NAME || 'omc_test',
  user: process.env.TESTING_DATABASE_USER || 'postgres',
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} not found`);
  },
  forceUtcTimezone: true,
  debug: process.env.TESTING_DEBUG === 'true',
  highlighter: new SqlHighlighter(),
};
