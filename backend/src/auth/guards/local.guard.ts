import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccountService } from '../../accounts/account.service';

@Injectable()
export class LocalGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (req.isAuthenticated()) {
      req.account = await this.accountService.findOne(req.user.id);

      return true;
    }

    return false;
  }
}
