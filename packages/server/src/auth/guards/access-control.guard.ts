import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControl, IQueryInfo } from 'accesscontrol';
import { PERMISSION_METADATA } from '../../app.constants';
import { Roles } from '../../app.roles';
import { InjectAC } from '../decorators/inject-ac.decorator';
import { TransformedGrant } from '../interfaces/grant.interface';

export class AccessGuard {
  constructor(
    private readonly reflector: Reflector,
    @InjectAC() private readonly ac: AccessControl,
  ) {}

  getUserRoles(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    if (!req.usr) throw new UnauthorizedException();

    return req.usr.roles;
  }

  getUserVerified(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    if (!req.usr) throw new UnauthorizedException();

    return req.usr.emailVerified;
  }

  canActivate(ctx: ExecutionContext) {
    const grant = this.reflector.get<TransformedGrant>(
      PERMISSION_METADATA,
      ctx.getHandler(),
    );

    if (!grant) return true;

    const roles: Roles[] = this.getUserRoles(ctx);

    if (!roles.length) roles.push(Roles.DEFAULT);

    const grants: IQueryInfo[] = grant.permissions.map((permission) => ({
      role: roles,
      resource: grant.resource,
      action: permission,
    }));

    let hasPermission = grants.every(
      (grant) => this.ac.permission(grant).granted,
    );

    if (grant.flags.verified) {
      hasPermission &&= this.getUserVerified(ctx);
    }

    return hasPermission;
  }
}
