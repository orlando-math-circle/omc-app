import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';

describe('Account Controller', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            getMe: jest.fn().mockReturnValue(new Account()),
          },
        },
      ],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => expect(accountController).toBeDefined());

  describe('/GET me', () => {
    it('should create an account', () => {
      const ret = accountController.getMe(new Account());
      expect(typeof ret).toBe('object');
    });
  });
});
