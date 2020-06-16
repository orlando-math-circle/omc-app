import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
import { BCRYPT_ROUNDS } from '../app.constants';
import { isNumber } from '../app.utils';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../email/email.service';
import { User } from '../user/user.entity';
import { Account } from './account.entity';
import { CreateAccountDTO } from './dtos/create-account.dto';
import { UpdateAccountDTO } from './dtos/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  async create(createAccountDTO: CreateAccountDTO) {
    const account = new Account();
    const user = new User().assign(createAccountDTO);

    user.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    account.users.add(user);

    await this.accountRepository.persistAndFlush(account);
    account.users.populated(true);

    this.emailService.email(
      user.email,
      this.authService.sign({ email: user.email }, { expiresIn: '2 days' }),
    );

    return account;
  }

  async findOne(id: number) {
    return this.accountRepository.findOne(id);
  }

  async findOneOrFail(id: number) {
    return this.accountRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateAccountDTO: UpdateAccountDTO,
  ): Promise<Account>;
  async update(
    account: Account,
    updateAccountDTO: UpdateAccountDTO,
  ): Promise<Account>;
  async update(
    idOrAccount: number | Account,
    updateAccountDTO: UpdateAccountDTO,
  ) {
    const account = isNumber(idOrAccount)
      ? await this.accountRepository.findOneOrFail(idOrAccount)
      : idOrAccount;

    account.assign(updateAccountDTO);

    await this.accountRepository.flush();

    return account;
  }

  async delete(id: number) {
    return this.accountRepository.remove({ id });
  }
}
