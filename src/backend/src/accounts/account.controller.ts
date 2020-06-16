import { Controller, Param } from '@nestjs/common';
import { Acc } from '../auth/decorators/account.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { FindOneAccountDTO } from './dtos/find-one-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Auth()
  getMe(@Acc() account: Account) {
    return account;
  }

  @Auth('account', 'read:any')
  findOne(@Param() { id }: FindOneAccountDTO) {
    return this.accountService.findOneOrFail(id);
  }
}
