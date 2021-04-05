import { Injectable } from '@nestjs/common';
import { AccessControl } from 'accesscontrol';
import { User } from '../user/user.entity';
import { InjectAC } from './decorators/inject-ac.decorator';
import { Permission } from './interfaces/grant.interface';

@Injectable()
export class AccessService {
  constructor(@InjectAC() private readonly ac: AccessControl) {}

  /**
   * Returns if the specified user is granted a permission
   * on a resource.
   *
   * @param user User with the roles to be checked.
   * @param permission The type of access being validated.
   * @param resource The entity to compare against.
   */
  can(user: User, permission: Permission, resource: string) {
    return this.ac.permission({
      role: user.roles,
      action: permission,
      resource: resource,
    }).granted;
  }
}
