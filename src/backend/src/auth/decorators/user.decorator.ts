import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/user.entity';

/**
 * Passes the user entity from the request if available.
 */
export const Usr = createParamDecorator<keyof User>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.usr;

    return data ? user && user[data] : user;
  },
);
