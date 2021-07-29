import { AccessControl } from 'accesscontrol';

export enum Roles {
  ADMIN = 'admin',
  VOLUNTEER = 'volunteer',
  DEFAULT = 'default',
}

const ac = new AccessControl();

ac.grant(Roles.DEFAULT)
  .createOwn('user')
  .updateOwn('user')
  .readAny('course')
  .readAny('project')
  .readAny('event')
  .readOwn('user')
  .readOwn('file')
  .readAny('file-field')
  .createOwn('file-attachment')
  .readOwn('file-attachment')
  .deleteOwn('file-attachment')
  .createOwn('event-registration')
  .readAny('event-registration')
  .readOwn('event-registration')
  .deleteOwn('event-registration')
  .createOwn('file')
  .readOwn('file')
  .readAny('volunteer-job')
  .readAny('volunteer-work')
  .grant(Roles.VOLUNTEER)
  .extend(Roles.DEFAULT)
  .createOwn('volunteer-registration')
  .createOwn('volunteer-work')
  .grant(Roles.ADMIN)
  .extend(Roles.VOLUNTEER)
  .createAny('system')
  .readAny('system')
  .updateAny('system')
  .deleteAny('system')
  .createAny('file')
  .readAny('file')
  .updateAny('file')
  .deleteAny('file')
  .createAny('file-field')
  .updateAny('file-field')
  .deleteAny('file-Field')
  .createAny('file-attachment')
  .readAny('file-attachment')
  .updateAny('file-attachment')
  .deleteAny('file-attachment')
  .createAny('event-registration')
  .updateAny('event-registration')
  .deleteAny('event-registration')
  .createAny('account')
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
  .deleteAny('user')
  .createAny('volunteer-work')
  .updateAny('volunteer-work')
  .deleteAny('volunteer-work')
  .createAny('volunteer-job')
  .updateAny('volunteer-job')
  .deleteAny('volunteer-job')
  .createAny('email');

export default ac;
