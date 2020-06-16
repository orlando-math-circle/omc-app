import { AccessControl } from 'accesscontrol';

export enum Roles {
  ADMIN = 'admin',
  GUEST = 'guest',
}

const ac = new AccessControl();

ac.grant(Roles.GUEST)
  .grant(Roles.ADMIN)
  .extend(Roles.GUEST)
  .readAny('account')
  .updateAny('account')
  .deleteAny('account');

export default ac;
