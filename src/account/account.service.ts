import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, FilterQuery } from 'mikro-orm';
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
   * Retrieves an individual user or returns null.
   *
   * @param id id of the account to find
   * @param populate which, or all, relationships to populate
   */
  async findOne(id: number, populate?: boolean | string[]): Promise<Account>;

  /**
   * Retrieves an individual user or returns null.
   *
   * @param where object query of the properties to use for retrieval
   * @param populate which, or all, relationships to populate
   */
  async findOne(
    where: FilterQuery<Account>,
    populate?: boolean | string[],
  ): Promise<Account>;

  async findOne(
    prop: number | FilterQuery<Account>,
    populate?: boolean | string[],
  ) {
    const where = isNumber(prop) ? { id: prop } : prop;

    return this.accountRepository.findOne(where, populate);
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
