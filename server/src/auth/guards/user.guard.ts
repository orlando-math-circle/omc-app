import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard requiring a fully qualified JWT.
 */
export class UserGuard extends AuthGuard('jwt') {
  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    const canActivate = await super.canActivate(ctx);
    return canActivate && !!request.usr;
  }
}
