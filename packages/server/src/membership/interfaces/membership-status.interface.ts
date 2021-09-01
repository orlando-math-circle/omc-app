import { User } from '../../user/user.entity';
import { Membership } from '../membership.entity';

export interface MembershipStatus {
  user: User;
  fee: string | null;
  isMember: boolean;
  membership?: Membership;
}
