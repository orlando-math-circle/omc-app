import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AccountModule } from '../src/account/account.module';
import { CreateAccountDto } from '../src/account/dtos/create-account.dto';
import { testSchema } from '../src/app.config';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { EmailModule } from '../src/email/email.module';
import { PayPalToken } from '../src/paypal/paypal-token.class';
import { PayPalModule } from '../src/paypal/paypal.module';
import { PayPalService } from '../src/paypal/paypal.service';
import { UserModule } from '../src/user/user.module';
import { MikroORMTestingConfig } from './mikro-orm.test-config';
import { PayPalMock } from './mocks/paypal.mock';

describe('PayPal', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;
  let paypalService: PayPalService;

  /**
   * Testing Data
   */

  let token: string;

  const createAccountDto: CreateAccountDto = {
    name: 'Jane Doe',
    email: 'jane@doe.com',
    password: 'apple',
    dob: new Date(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: testSchema,
          isGlobal: true,
        }),
        MikroOrmModule.forRoot(MikroORMTestingConfig),
        EmailModule,
        AccountModule,
        UserModule,
        AuthModule,
        PayPalModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);
    paypalService = moduleRef.get(PayPalService);

    const generator = orm.getSchemaGenerator();
    await generator.ensureDatabase();
    await generator.dropSchema();
    await generator.createSchema();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
      }),
    );
    app.useGlobalFilters(new JsonWebTokenFilter());

    await app.init();

    /**
     * Seeding Data
     */

    await request(app.getHttpServer())
      .post('/account/register')
      .send(createAccountDto)
      .expect(201);

    const loginResp = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'jane@doe.com', password: 'apple' })
      .expect(201);

    expect(typeof loginResp.body.token).toBe('string');
    token = loginResp.body.token;
  });

  afterEach(() => {
    orm.em.clear();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe('PayPal Service', () => {
    const paypalMock = new PayPalMock('8CE039157E416322V', '15.75', '1');

    const mockData = {
      auth: paypalMock.getAuthCredentials(),
      get: paypalMock.getOrderMock,
      create: paypalMock.getCreateMock(),
      capture: paypalMock.getCreateMock(),
    };

    it('should be defined', () => expect(paypalService).toBeDefined());

    it('should successfully create orders', async () => {
      const spy = jest
        .spyOn(paypalService['axios'], 'post')
        .mockImplementation((url) => {
          switch (url) {
            case '/v1/oauth2/token':
              return Promise.resolve({ data: mockData.auth });
            case '/v2/checkout/orders':
              return Promise.resolve({ data: mockData.create });
          }
        });

      await expect(
        paypalService.createOrder('15.75', '1'),
      ).resolves.toStrictEqual(mockData.capture);

      expect(spy).toBeCalledTimes(1);
    });

    it('should successfully capture orders', async () => {
      const spy = jest
        .spyOn(paypalService['axios'], 'post')
        .mockImplementation((url) => {
          switch (url) {
            case '/v1/oauth2/token':
              return Promise.resolve({ data: mockData.auth });
            case `/v2/checkout/orders/${paypalMock.id}/capture`:
              return Promise.resolve({ data: mockData.capture });
          }
        });

      await expect(
        paypalService.captureOrder(paypalMock.id),
      ).resolves.toStrictEqual(mockData.capture);

      expect(spy).toBeCalledTimes(1);
    });

    it('should successfully retrieve orders', async () => {
      jest
        .spyOn(paypalService['axios'], 'post')
        .mockResolvedValueOnce({ data: mockData.auth });
      const spy = jest
        .spyOn(paypalService['axios'], 'get')
        .mockResolvedValueOnce({ data: mockData.get });

      await expect(
        paypalService.getOrder(paypalMock.id),
      ).resolves.toStrictEqual(mockData.get);

      expect(spy).toBeCalledTimes(1);
    });

    it('should have set a token before a request', async () => {
      jest
        .spyOn(paypalService['axios'], 'post')
        .mockResolvedValueOnce({ data: mockData.auth });
      const spy = jest
        .spyOn(paypalService['axios'], 'get')
        .mockResolvedValueOnce({ data: mockData.get });

      await expect(
        paypalService.getOrder(paypalMock.id),
      ).resolves.toStrictEqual(mockData.get);

      expect(spy).toBeCalledTimes(1);
      console.log(paypalService['token']);
      expect(paypalService['token']).toBeDefined();
      expect(paypalService['token'] instanceof PayPalToken).toBeTruthy();
    });
  });
});
