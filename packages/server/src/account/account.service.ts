import {
  EntityData,
  EntityRepository,
  FilterQuery,
  Populate,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { BCRYPT_ROUNDS } from '../app.constants';
import { Roles } from '../app.roles';
import { isNumber } from '../app.utils';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';
import { Email } from '../email/email.class';
import { EmailService } from '../email/email.service';
import { User } from '../user/user.entity';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { RegisterAccountDto } from './dto/register.dto';

@Injectable()
export class AccountService {
  private readonly ADMIN_EMAIL?: string;

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.ADMIN_EMAIL = config.ADMIN_EMAIL;
  }

  /**
   * Creates an account by cascade-inserting the primary user.
   *
   * @param dto Properties of the primary user.
   */
  async create(dto: CreateAccountDto | RegisterAccountDto) {
    const account = new Account();
    const user = new User();
    this.accountRepository.persist(user);

    if (dto.industry) {
      dto.industry = classToPlain(dto.industry);
    }

    user.assign(dto);
    user.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    account.primaryUser = user;
    account.users.add(user);

    await this.accountRepository.persist(account).flush();

    account.users.populated(true);
    account.primaryUser.populated(true);

    // Check if there is an admin override.
    if (user.email === this.ADMIN_EMAIL) {
      user.roles.push(Roles.ADMIN);
    }

    // Send a verification email if the admin didn't pre-verify them.
    if (!user.emailVerified) {
      const token = this.authService.signJWT(
        { email: account.primaryUser.email! },
        undefined,
        {
          expiresIn: '2 days',
        },
      );

      const email = new Email()
        .setTemplate(this.config.MAILERSEND.TEMPLATES.VERIFY)
        .setTo(account.primaryUser.email!, undefined, {
          first_name: account.primaryUser.first,
          verify_link: `${this.config.FILES.FRONTEND_URL}/verify?token=${token}`,
        });

      await this.emailService.send(email);
    }

    return account;
  }

  /**
   * Creates a new account, sends the verification email,
   * and creates a token for their immediate login.
   *
   * @param createAccountDto Properties of the primary user.
   */
  public async register(registerAccountDto: RegisterAccountDto) {
    const account = await this.create(registerAccountDto);

    return this.authService.login(account, account.primaryUser);
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
  async findOneOrFail(
    where: FilterQuery<Account>,
    populate?: Populate<Account>,
  ) {
    return this.accountRepository.findOneOrFail(where, populate);
  }

  /**
   * Updates an account by applying provided entity data.
   *
   * @param where primary key or object of entity parameters
   * @param data Account entity data to change
   * @param populate loading all relations or a string array of relation names to load
   * @param orderBy object describing the ordering nature of the selection
   */
  async update(
    where: FilterQuery<Account>,
    data: EntityData<Account>,
    populate?: boolean | string[],
    orderBy?: QueryOrderMap,
  ) {
    const account = await this.accountRepository.findOneOrFail(
      where,
      populate,
      orderBy,
    );

    account.assign(data);
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
