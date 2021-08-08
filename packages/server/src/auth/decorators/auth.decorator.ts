import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSION_METADATA } from '../../app.constants';
import { AccessGuard } from '../guards/access-control.guard';
import { AccountGuard } from '../guards/account.guard';
import { UserGuard } from '../guards/user.guard';
import { Permission, UserAuthFlags } from '../interfaces/grant.interface';

/**
 * Controller decorator requiring at least a
 * semi-qualified token for authentication.
 */
export function AccountAuth(): MethodDecorator {
  return applyDecorators(UseGuards(AccountGuard));
}

/**
 * Controller decorator requiring a fully-qualified
 * user token for authentication.
 */
export function UserAuth(): MethodDecorator;

/**
 * Controller decorator that checks if the user is authenticated
 * and authorized for the resource and given permission.
 */
export function UserAuth(
  resource: string,
  permission: Permission,
  flags?: UserAuthFlags,
): MethodDecorator;

/**
 * Controller decorator that checks if the user is authenticated
 * and authorized for the resource and all permissions.
 */
export function UserAuth(
  resource: string,
  permissions: Permission[],
  flags?: UserAuthFlags,
): MethodDecorator;

export function UserAuth(
  resource?: string,
  permissions?: Permission | Permission[],
  flags?: UserAuthFlags,
): MethodDecorator {
  if (!resource) return applyDecorators(UseGuards(UserGuard));

  return applyDecorators(
    SetMetadata(PERMISSION_METADATA, {
      resource,
      permissions: Array.isArray(permissions) ? permissions : [permissions],
      flags: flags || {},
    }),
    UseGuards(AuthGuard('jwt'), AccessGuard),
  );
}
