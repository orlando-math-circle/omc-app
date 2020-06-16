import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSION_METADATA } from '../../app.constants';
import { AccessGuard } from '../guards/access-control.guard';
import { AccountGuard } from '../guards/account.guard';
import { Permission } from '../interfaces/grant.interface';

export function Auth(): MethodDecorator;

export function Auth(resource: string, permission: Permission): MethodDecorator;

export function Auth(
  resource: string,
  permissions: Permission[],
): MethodDecorator;

export function Auth(
  resource?: string,
  permissions?: Permission | Permission[],
): MethodDecorator {
  if (!resource) return applyDecorators(UseGuards(AccountGuard));

  return applyDecorators(
    SetMetadata(PERMISSION_METADATA, {
      resource,
      permissions: Array.isArray(permissions) ? permissions : [permissions],
    }),
    UseGuards(AuthGuard('jwt'), AccessGuard),
  );
}
