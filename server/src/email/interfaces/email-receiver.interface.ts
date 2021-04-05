import { PersonalizationData } from '@sendgrid/helpers/classes/personalization';
import { User } from '../../user/user.entity';

export type EmailReceiver =
  | User
  | string
  | PersonalizationData
  | User[]
  | string[]
  | PersonalizationData[];

export { PersonalizationData };
