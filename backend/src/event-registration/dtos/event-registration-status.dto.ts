import { User } from '../../user/user.entity';

export class EventRegistrationStatus {
  user: User;
  eligible: boolean;
  paid?: boolean;
  registered: boolean;
}
