import { AccessControl } from 'accesscontrol';

export enum Roles {
  ADMIN = 'admin',
  PARENT = 'parent',
  GUEST = 'guest',
}

const ac = new AccessControl();

ac.grant(Roles.GUEST)
  .createOwn('user')
  .readAny('course')
  .readAny('project')
  .readAny('event')
  .readOwn('user')
  .grant(Roles.PARENT)
  .extend(Roles.GUEST)
  .createOwn('event-registration')
  .createOwn('file')
  .grant(Roles.ADMIN)
  .extend(Roles.PARENT)
  .readAny('account')
  .updateAny('account')
  .deleteAny('account')
  .createAny('course')
  .updateAny('course')
  .deleteAny('course')
  .createAny('event')
  .updateAny('event')
  .deleteAny('event')
  .createAny('project')
  .updateAny('project')
  .deleteAny('project')
  .createAny('user')
  .readAny('user')
  .updateAny('user')
  .deleteAny('user');

export default ac;
