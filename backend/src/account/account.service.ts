import {
  EntityData,
  EntityRepository,
  FilterQuery,
  Populate,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { ConfigSchema } from '../app.config';
import { BCRYPT_ROUNDS } from '../app.constants';
import { Roles } from '../app.roles';
import { isNumber } from '../app.utils';
import { AuthService } from '../auth/auth.service';
import { Email } from '../email/email.class';
import { SENDGRID_VERIFY_TEMPLATE } from '../email/email.constants';
import { EmailService } from '../email/email.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Account } from './account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly config: ConfigService<ConfigSchema>,
  ) {}

  /**
   * Creates an account by cascade-inserting the primary user.
   *
   * @param createAccountDto properties of the primary user
   */
  async create(createAccountDto: CreateAccountDto) {
    const existingUser = await this.userService.findOne({
      email: createAccountDto.email,
    });

    if (existingUser) {
      throw new ConflictException();
    }

    const account = new Account();
    const user = new User();
    this.accountRepository.persist(user);

    if (createAccountDto.industry) {
      createAccountDto.industry = classToPlain(createAccountDto.industry);
    }

    user.assign(createAccountDto);
    user.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    account.primaryUser = user;
    account.users.add(user);

    // Check if there is an admin override.
    const adminEmail = this.config.get('ADMIN_EMAIL');
    if (adminEmail && user.email === adminEmail) {
      user.roles = [Roles.ADMIN];
    }

    await this.accountRepository.persistAndFlush(account);
    account.users.populated(true);

    const token = this.authService.signJWT({ email: user.email }, null, {
      expiresIn: '2 days',
    });

    this.emailService.send(
      new Email(user.email, 'Verify Your Email', {
        templateId: SENDGRID_VERIFY_TEMPLATE,
        templateData: {
          first_name: user.first,
          verify_link: `${this.config.get(
            'FRONTEND_URL',
          )}/verify?token=${token}`,
        },
      }),
    );

    return this.authService.login(account, user);
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
