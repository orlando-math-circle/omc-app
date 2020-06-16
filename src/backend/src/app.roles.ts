import { AccessControl } from 'accesscontrol';

export enum Roles {
  ADMIN = 'admin',
}

const ac = new AccessControl();

export default ac;
