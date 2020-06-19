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

  /**
   * Creates an account by cascade-inserting the primary user.
   *
   * @param createAccountDTO properties of the primary user
   */
  async create(createAccountDTO: CreateAccountDTO) {
    const account = new Account();
    const user = new User().assign(createAccountDTO);

    user.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    account.primaryUser = user;
    account.users.add(user);

    await this.accountRepository.persistAndFlush(account);
    account.users.populated(true);

    this.emailService.email(
      user.email,
      this.authService.signJWT({ email: user.email }, null, {
        expiresIn: '2 days',
      }),
    );

    return account;
  }

  /**
   * Finds an individual account or returns `undefined`
   * @param id id of the account to find
   */
  async findOne(id: number) {
    return this.accountRepository.findOne(id);
  }

  /**
   * Finds an individual account or returns a `404 NotFoundException`
   * @param id id of the account to find
   */
  async findOneOrFail(id: number) {
    return this.accountRepository.findOneOrFail(id);
  }

  /**
   * Updates an account with admin privileges.
   *
   * @param id id of the account to update
   * @param updateAccountDTO properties to update
   */
  async update(
    id: number,
    updateAccountDTO: UpdateAccountDTO,
  ): Promise<Account>;

  /**
   * Updates an account with admin privileges.
   * @param account account to update
   * @param updateAccountDTO properties to update
   */
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

  /**
   * Deletes an account and removes all connected users, permanently.
   *
   * @param id id of the account to remove
   */
  async delete(id: number) {
    // Relations must be loaded for them to be cascade-removed.
    const account = await this.accountRepository.findOneOrFail(id, true);

    await this.accountRepository.removeAndFlush(account);
  }
}
