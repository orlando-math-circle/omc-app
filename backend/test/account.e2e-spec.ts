import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Account } from '../src/account/account.entity';
import { AccountModule } from '../src/account/account.module';
import { testSchema } from '../src/app.config';
import { Roles } from '../src/app.roles';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { EmailModule } from '../src/email/email.module';
import { FileModule } from '../src/file/file.module';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { UserFixtures } from './fixtures/user.fixture';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Accounts', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  let userFixtures: UserFixtures;
  let token: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
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
        FileModule,
      ],
    }).compile();

    app = module.createNestApplication();
    orm = module.get<MikroORM>(MikroORM);

    userFixtures = new UserFixtures(app, orm);

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

    token = await userFixtures.createAccount();
  });

  afterEach(() => {
    orm.em.clear();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
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
      expect(resp.body.id).toBe(1);
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
      const acc = await orm.em.findOne(Account, { id: 1 });

      expect(acc).toBeNull();
    });

    it('should remove orphaned account users', async () => {
      const users = await orm.em.find(User, {});

      expect(users.length).toBe(0);
    });
  });
});
