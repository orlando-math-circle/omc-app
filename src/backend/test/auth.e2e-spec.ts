import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection, IDatabaseDriver, MikroORM } from 'mikro-orm';
import request from 'supertest';
import MikroORMConfig from '../mikro-orm.config';
import { CreateAccountDTO } from '../src/account/dtos/create-account.dto';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { EmailService } from '../src/email/email.service';
import { User } from '../src/user/user.entity';
import { UserService } from '../src/user/user.service';

delete MikroORMConfig.user;
delete MikroORMConfig.password;
MikroORMConfig.dbName = 'omc_test';

const createAccountDTO: CreateAccountDTO = {
  name: 'Jane Doe',
  email: 'jane@doe.com',
  password: 'apple',
  dob: new Date(),
};

describe('Auth', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;
  let authService: AuthService;

  /**
   * Testing Data
   */

  let token: string;
  let forgotToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MikroORM)
      .useFactory({
        factory: async () => {
          return await MikroORM.init(MikroORMConfig);
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);
    authService = moduleRef.get<AuthService>(AuthService);

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
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /login', () => {
    it('should accept valid logins', async () => {
      await request(app.getHttpServer())
        .post('/account/register')
        .send(createAccountDTO)
        .expect(201);

      const resp = await request(app.getHttpServer())
        .post('/login')
        .send({ email: 'jane@doe.com', password: 'apple' })
        .expect(201);

      expect(typeof resp.body.token).toBe('string');
      token = resp.body.token;
    });

    it('should reject invalid logins', async () => {
      await request(app.getHttpServer())
        .post('/login')
        .send({ email: 'jane@doe.com', password: 'invalid' })
        .expect(401);
    });

    it('should throw a 500 exception a user lacks an account', async () => {
      jest
        .spyOn(AuthService.prototype, 'validateLogin')
        .mockResolvedValue({ id: 1 } as User);

      await request(app.getHttpServer())
        .post('/login')
        .send({ email: 'jane@doe.com', password: 'apple' })
        .expect(500);
    });
  });

  describe('Token Strategy', () => {
    it('should reject invalid tokens', async () => {
      const jwt = authService.signJWT({ invalid: true });

      const resp = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(401);

      expect(resp.body.message).toBe('Malformed Token');
    });

    it('should throw a 500 exception when a user lacks an account', async () => {
      jest
        .spyOn(UserService.prototype, 'findOne')
        .mockResolvedValue({ id: 1 } as User);

      await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
  });

  describe('POST /logout', () => {
    it('should retrieve accounts without `logoutAt`', async () => {
      const resp = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resp.body.id).toBe(1);
      expect(resp.body.logoutAt).toBeNull();
    });

    it('should logout the account and invalidate the token', async () => {
      await request(app.getHttpServer())
        .post('/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const resp = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      expect(resp.body.message).toBe('Token Revoked');
    });

    it('should allow reflow with a `logoutAt` date', async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      let resp = await request(app.getHttpServer())
        .post('/login')
        .send({ email: 'jane@doe.com', password: 'apple' })
        .expect(201);

      expect(resp.body.token).not.toBe(token);
      expect(typeof resp.body.token).toBe('string');

      token = resp.body.token;

      resp = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(typeof resp.body.logoutAt).toBe('string');
    });
  });

  describe('POST /verify/email', () => {
    it('should reject malformed tokens', async () => {
      await request(app.getHttpServer())
        .post('/verify/email')
        .send({ token: 'not-a-token' })
        .expect(400);
    });

    it('should validate emails', async () => {
      // TODO: Once the email service is implemented, this needs to be replaced.
      const verifyToken = authService.signJWT({
        email: createAccountDTO.email,
      });

      await request(app.getHttpServer())
        .post('/verify/email')
        .send({ token: verifyToken })
        .expect(201);

      const user = await orm.em.findOneOrFail(User, { id: 1 });

      expect(user.emailVerified).toBe(true);
    });

    it('should throw on unknown payloads', async () => {
      const badToken = authService.signJWT({ invalid: true });

      await request(app.getHttpServer())
        .post('/verify/email')
        .send({ token: badToken })
        .expect(400);
    });

    it('should throw on unknown emails', async () => {
      const badToken = authService.signJWT({ email: 'fake@email.com' });

      await request(app.getHttpServer())
        .post('/verify')
        .send({ token: badToken })
        .expect(404);
    });

    it('should throw on already validated users', async () => {
      const verifyToken = authService.signJWT({ email: 'jane@doe.com' });

      await request(app.getHttpServer())
        .post('/verify/email')
        .send({ token: verifyToken })
        .expect(410);
    });
  });

  describe('POST /forgot', () => {
    it('should still succeed on invalid emails', async () => {
      await request(app.getHttpServer())
        .post('/forgot')
        .send({ email: 'not@real.com' })
        .expect(201);
    });

    it('should send an email to the user', async () => {
      const spy = jest.spyOn(EmailService.prototype, 'email');

      await request(app.getHttpServer())
        .post('/forgot')
        .send({ email: 'jane@doe.com' })
        .expect(201);

      expect(spy).toBeCalled();
      expect(typeof spy.mock.calls[0][1]).toBe('string');
      forgotToken = spy.mock.calls[0][1];
    });
  });

  describe('POST /verify/reset', () => {
    it('should reject incorrect token secrets', async () => {
      const malformedToken = authService.signJWT({ invalid: true });

      await request(app.getHttpServer())
        .post('/verify/reset')
        .send({ token: malformedToken })
        .expect(400);
    });

    it('should reject tokens for non-users', async () => {
      const malformedToken = authService.signJWT({ uid: 50 });

      await request(app.getHttpServer())
        .post('/verify/reset')
        .send({ token: malformedToken })
        .expect(400);
    });

    it('should reject tokens with invalid secrets', async () => {
      const token = authService.signJWT({ uid: 1 });

      const resp = await request(app.getHttpServer())
        .post('/verify/reset')
        .send({ token })
        .expect(400);

      expect(resp.body.message).toBe('invalid signature');
    });
  });

  describe('POST /reset', () => {
    it("should change the user's password", async () => {
      const beforeUser = await orm.em.findOne(User, { id: 1 });

      expect(beforeUser).toBeDefined();

      await request(app.getHttpServer())
        .post('/reset')
        .send({ token: forgotToken, password: 'banana' })
        .expect(201);

      // The orm is unaware a change was made, force to decache.
      orm.em.clear();

      const user = await orm.em.findOne(User, { id: 1 });

      expect(user).toBeDefined();
      expect(user.password).not.toBe('banana');
      expect(beforeUser.password).not.toBe(user.password);
    });
  });
});
