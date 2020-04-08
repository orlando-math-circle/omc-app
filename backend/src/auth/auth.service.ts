import { Injectable } from '@nestjs/common';
import { AccountService } from '../accounts/account.service';

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  async validateAccount(email: string, password: string) {
    const account = await this.accountService.findOneByEmail(email);

    // TODO: Add Bcrypt.
    if (account && account.password === password) {
      return account;
    }

    return null;
  }
}
