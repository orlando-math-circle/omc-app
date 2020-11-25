import { User } from '../../user/user.entity';
import { EventRegistration } from '../event-registration.entity';

export class EventRegistrationStatus {
  user: User;
  eligible: boolean;
  paid?: boolean;
  registration: EventRegistration | false;
}
