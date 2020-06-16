import { Test } from '@nestjs/testing';
import { BaseEntity, EntityRepository } from 'mikro-orm';
import { getRepositoryToken } from 'nestjs-mikro-orm';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../email/email.service';
import { User } from '../user/user.entity';
import { Account } from './account.entity';
import { AccountService } from './account.service';

const mockAccounts: Account[] = [
  Object.assign(new Account(), { id: 1, logoutAt: new Date() }),
  Object.assign(new Account(), { id: 2 }),
  Object.assign(new Account(), { id: 3 }),
];

const createAccountDTO = {
  password: 'apple',
  email: 'jane@doe.com',
  name: 'Jane Doe',
  dob: new Date(),
};

const mockUsers: User[] = [Object.assign(new User(), createAccountDTO)];

describe('AccountService', () => {
  let accountRepository: EntityRepository<Account>;
  let accountService: AccountService;
  let emailService: EmailService;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            persistAndFlush: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            email: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: AuthService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    accountService = module.get<AccountService>(AccountService);
    accountRepository = module.get<EntityRepository<Account>>(
      getRepositoryToken(Account),
    );
  });

  it('should be defined', () => expect(accountService).toBeDefined());

  // test('/POST create', async () => {
  //   console.log(Account.prototype);
  //   const accountSpy = jest
  //     .spyOn(BaseEntity.prototype, 'assign')
  //     .mockResolvedValue(mockUsers[0]);

  //   const repoSpy = jest.spyOn(accountRepository, 'persistAndFlush');
  //   expect(accountService.create(createAccountDTO)).resolves;
  //   expect(repoSpy).toBeCalled();
  // });
});
