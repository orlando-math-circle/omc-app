import { INestApplication } from '@nestjs/common';
import { Connection, IDatabaseDriver, MikroORM } from 'mikro-orm';
import request from 'supertest';
import { Account } from '../src/accounts/account.entity';
import { CreateAccountDTO } from '../src/accounts/dtos/create-account.dto';
import { Roles } from '../src/app.roles';
import { User } from '../src/user/user.entity';
import { createMikroTestingModule } from './bootstrap';

const createAccountDTO: CreateAccountDTO = {
  name: 'Jane Doe',
  email: 'jane@doe.com',
  password: 'apple',
  dob: new Date(),
};

describe('Accounts', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  let account: Account;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await createMikroTestingModule();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);

    const generator = orm.getSchemaGenerator();
    await generator.ensureDatabase();
    await generator.dropSchema();
    await generator.createSchema();

    await app.init();
  });

  test('POST /account/register', async () => {
    const resp = await request(app.getHttpServer())
      .post('/account/register')
      .send(createAccountDTO)
      .expect(201);

    expect(typeof resp.body).toBe('object');
    expect(resp.body.id).toBe(1);
    account = resp.body;

    // Login for token
    const loginResp = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'jane@doe.com', password: 'apple' })
      .expect(201);

    expect(typeof loginResp.body.token).toBe('string');
    token = loginResp.body.token;
  });

  describe('GET /account/me', () => {
    it('should throw on unauthenticated requests', () => {
      request(app.getHttpServer()).get('/account/me').expect(401);
    });

    it('should retrieve the authed account', async () => {
      const resp = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.id).toBe(account.id);
    });
  });

  describe('GET /account/:id', () => {
    it('should reject arbitrary account lookup', async () => {
      request(app.getHttpServer())
        .get('/account/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    it('should retrieve account lookup for admins', async () => {
      const acc = await orm.em.findOne(Account, { id: 1 }, true);
      expect(acc).toBeDefined();
      acc.primaryUser.roles = [Roles.ADMIN];

      await orm.em.flush();

      expect(acc.primaryUser.roles).toStrictEqual(['admin']);

      await request(app.getHttpServer())
        .get('/account/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should throw 404 on non-existant accounts', () => {
      request(app.getHttpServer())
        .get('/account/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('DELETE /account/:id', () => {
    it('should throw 401 for unauthenticated requests', () => {
      request(app.getHttpServer()).delete('/account/1').expect(401);
    });

    it('should delete accounts', async () => {
      await request(app.getHttpServer())
        .delete('/account/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should invalidate login', async () => {
      await request(app.getHttpServer())
        .get('/account/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    it('should no longer find the account', async () => {
      orm.em.clear();
      const acc = await orm.em.findOne(Account, { id: account.id });

      expect(acc).toBeNull();
    });

    it('should remove orphaned account users', async () => {
      const users = await orm.em.find(User, {});

      expect(users.length).toBe(0);
    });
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });
});
