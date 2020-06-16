import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControl, IQueryInfo } from 'accesscontrol';
import { PERMISSION_METADATA } from '../../app.constants';
import { InjectAC } from '../decorators/inject-ac.decorator';
import { TransformedGrant } from '../interfaces/grant.interface';

export class AccessGuard {
  constructor(
    private readonly reflector: Reflector,
    @InjectAC() private readonly ac: AccessControl,
  ) {}

  getUserRoles(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    if (!req.user) throw new UnauthorizedException();

    return req.user.roles;
  }

  canActivate(ctx: ExecutionContext) {
    const grant = this.reflector.get<TransformedGrant>(
      PERMISSION_METADATA,
      ctx.getHandler(),
    );

    if (!grant) return true;

    const roles = this.getUserRoles(ctx);
    const grants: IQueryInfo[] = grant.permissions.map((permission) => ({
      role: roles,
      resource: grant.resource,
      permission,
    }));

    const hasPermission = grants.every(
      (grant) => this.ac.permission(grant).granted,
    );

    return hasPermission;
  }
}
