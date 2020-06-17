import { INestApplication } from '@nestjs/common';
import { Connection, IDatabaseDriver, MikroORM } from 'mikro-orm';
import { createMikroTestingModule } from './bootstrap';
import { AuthService } from '../src/auth/auth.service';
import { CreateAccountDTO } from '../src/account/dtos/create-account.dto';
import * as request from 'supertest';

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

  beforeAll(async () => {
    const moduleRef = await createMikroTestingModule();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);
    authService = moduleRef.get<AuthService>(AuthService);

    const generator = orm.getSchemaGenerator();
    await generator.ensureDatabase();
    await generator.dropSchema();
    await generator.createSchema();

    await app.init();
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

    it('should reject invalid logins', () => {
      request(app.getHttpServer())
        .post('/login')
        .send({ email: 'jane@doe.com', password: 'invalid' })
        .expect(401);
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

      expect(typeof resp.body.token).toBe('string');
      token = resp.body.token;

      resp = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(typeof resp.body.logoutAt).toBe('string');
    });
  });

  describe('POST /verify', () => {
    it('should reject malformed tokens', () => {
      request(app.getHttpServer()).post('/verify/malformedtoken').expect(400);
    });

    it('should validate emails', async () => {
      // TODO: Once the email service is implemented, this needs to be replaced.
      const verifyToken = authService.sign({ email: createAccountDTO.email });

      await request(app.getHttpServer())
        .post(`/verify/${verifyToken}`)
        .expect(201);

      const resp = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resp.body.primaryUser.emailVerified).toBe(true);
    });

    it('should throw on unknown payloads', async () => {
      const badToken = authService.sign({ invalid: true });

      await request(app.getHttpServer())
        .post(`/verify/${badToken}`)
        .expect(400);
    });

    it('should throw on unknown emails', async () => {
      const badToken = authService.sign({ email: 'fake@email.com' });

      await request(app.getHttpServer())
        .post(`/verify/${badToken}`)
        .expect(404);
    });

    it('should throw on already validated users', async () => {
      const badToken = authService.sign({ email: 'jane@doe.com' });

      await request(app.getHttpServer())
        .post(`/verify/${badToken}`)
        .expect(410);
    });
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });
});
