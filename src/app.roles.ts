import { AccessControl } from 'accesscontrol';

export enum Roles {
  ADMIN = 'admin',
  GUEST = 'guest',
}

const ac = new AccessControl();

ac.grant(Roles.GUEST)
  .createOwn('user')
  .readOwn('user')
  .createOwn('event-registration')
  .grant(Roles.ADMIN)
  .extend(Roles.GUEST)
  .readAny('account')
  .updateAny('account')
  .deleteAny('account')
  .createAny('event')
  .updateAny('event')
  .readAny('event')
  .deleteAny('event')
  .createAny('user')
  .readAny('user')
  .updateAny('user')
  .deleteAny('user');

export default ac;
