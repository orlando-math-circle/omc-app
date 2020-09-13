import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard requiring only a semi-qualified token.
 */
export class AccountGuard extends AuthGuard('jwt') {
  canActivate(ctx: ExecutionContext) {
    return super.canActivate(ctx);
  }
}
