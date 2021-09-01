import { EventRegistration } from '../../event-registration/event-registration.entity';
import { Event } from '../../event/event.entity';
import { User } from '../../user/user.entity';
import { ActivityRecord } from '../activity-record.entity';

export interface ActivityRecordResult {
  records: ActivityRecord[];
  users: User[];
  events: Event[];
  registrations: EventRegistration[];
}
