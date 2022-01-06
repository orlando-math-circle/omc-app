import { Account as _Account } from './account/account.entity';
import { ActivityRecord as _ActivityRecord } from './activity-record/activity-record.entity';
import { Attendance as _Attendance } from './attendance/attendance.entity';
import { Course as _Course } from './course/course.entity';
import { EventFee as _EventFee } from './event-fee/event-fee.entity';
import { EventRegistration as _EventRegistration } from './event-registration/event-registration.entity';
import { Event as _Event } from './event/event.entity';
import { FileAttachment as _FileAttachment } from './file-attachment/file-attachment.entity';
import { FileField as _FileField } from './file-field/file-field.entity';
import { File as _File } from './file/file.entity';
import { Invoice as _Invoice } from './invoice/invoice.entity';
import { Membership as _Membership } from './membership/membership.entity';
import { Project as _Project } from './project/project.entity';
import { EntityDTO } from './shared/types/entity-dto';
import { User as _User } from './user/user.entity';
import { VolunteerJob as _VolunteerJob } from './volunteer-job/volunteer-job.entity';
import { VolunteerWork as _VolunteerWork } from './volunteer-work/volunteer-work.entity';

// ====================================================
// Type utilities
// ====================================================

export type { EntityDTO };

// ====================================================
// Entities
// ====================================================

type Account = EntityDTO<_Account>;
type ActivityRecord = EntityDTO<_ActivityRecord>;
type Attendance = EntityDTO<_Attendance>;
type Course = EntityDTO<_Course>;
type Event = EntityDTO<_Event>;
type EventFee = EntityDTO<_EventFee>;
type EventRegistration = EntityDTO<_EventRegistration>;
type File = EntityDTO<_File>;
type FileAttachment = EntityDTO<_FileAttachment>;
type FileField = EntityDTO<_FileField>;
type Invoice = EntityDTO<_Invoice>;
type Membership = EntityDTO<_Membership>;
type Project = EntityDTO<_Project>;
type User = EntityDTO<_User>;
type VolunteerJob = EntityDTO<_VolunteerJob>;
type VolunteerWork = EntityDTO<_VolunteerWork>;

export {
  Account,
  ActivityRecord,
  Attendance,
  Course,
  Event,
  EventFee,
  EventRegistration,
  File,
  FileAttachment,
  FileField,
  Invoice,
  Membership,
  Project,
  User,
  VolunteerJob,
  VolunteerWork,
};

// ====================================================
// Data Transfer Objects
// ====================================================

export * from './account/dto';
export * from './activity-record/dto';
export * from './attendance/dto';
export * from './auth/dto';
export * from './course/dto';
export * from './email/dto';
export * from './event/dto';
export * from './event-fee/dto';
export * from './event-registration/dto';
export * from './file-field/dto';
export * from './invoice/dto';
export * from './membership/dto';
export * from './project/dto';
export * from './user/dto';
export * from './volunteer-job/dto';
export * from './volunteer-work/dto';

// ====================================================
// Interfaces
// ====================================================

// TODO: Convert this into a DTO, since... it's a dto?
import { MonthlyUserStatistic } from './user/interfaces/monthly-user-statistic.interface';

export { MonthlyUserStatistic };

// ====================================================
// Enums
// ====================================================

export { Roles } from './app.roles';
