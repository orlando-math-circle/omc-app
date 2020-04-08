import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Acc = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.account;
  },
);
