import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from '../../accounts/account.entity';

/**
 * Retrieves the account from an authenticated request.
 */
export const Acc = createParamDecorator<keyof Account>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const account: Account = request.account;

    return data ? account && account[data] : account;
  },
);
