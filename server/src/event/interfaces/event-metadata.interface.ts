import { Course } from '../../course/course.entity';
import { EventFee } from '../../event-fee/event-fee.entity';
import { Project } from '../../project/project.entity';
import { User } from '../../user/user.entity';
import { EventPermissionsDto } from '../dto/event-permissions.dto';
import { EventTimeThreshold } from '../enums/event-time-threshold.enum';
import { EventRecurrence } from '../event-recurrence.entity';

export interface EventMetadata {
  name: string;
  description?: string;
  location?: string;
  locationTitle: string;
  picture: string;
  color?: string;
  permissions?: EventPermissionsDto;
  cutoffThreshold: EventTimeThreshold;
  cutoffOffset: number;
  lateThreshold: EventTimeThreshold;
  lateOffset: number;
  fee?: EventFee;
  course?: Course;
  project?: Project;
  recurrence?: EventRecurrence;
  author: User;
}
