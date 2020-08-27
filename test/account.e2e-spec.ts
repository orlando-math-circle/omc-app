import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import MikroORMConfig from '../mikro-orm.config';
import { Account } from '../src/account/account.entity';
import { AccountModule } from '../src/account/account.module';
import { CreateAccountDto } from '../src/account/dtos/create-account.dto';
import configSchema from '../src/app.config';
import { Roles } from '../src/app.roles';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { EmailModule } from '../src/email/email.module';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';

delete MikroORMConfig.user;
delete MikroORMConfig.password;
delete MikroORMConfig.entitiesTs;

MikroORMConfig.debug = false;
MikroORMConfig.dbName = 'omc_test';
MikroORMConfig.entities = [Account, User];

const createAccountDto: CreateAccountDto = {
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
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: configSchema,
          isGlobal: true,
        }),
        MikroOrmModule.forRoot(MikroORMConfig),
        EmailModule,
        AccountModule,
        UserModule,
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);

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

  test('POST /account/register', async () => {
    const resp = await request(app.getHttpServer())
      .post('/account/register')
      .send(createAccountDto)
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
    it('should throw on unauthenticated requests', async () => {
      await request(app.getHttpServer()).get('/account/me').expect(401);
    });

    it('should retrieve the account', async () => {
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
      await request(app.getHttpServer())
        .get('/account/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
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

    it('should throw 404 on non-existant accounts', async () => {
      await request(app.getHttpServer())
        .get('/account/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('DELETE /account/:id', () => {
    it('should throw 401 for unauthenticated requests', async () => {
      await request(app.getHttpServer()).delete('/account/1').expect(401);
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
});
