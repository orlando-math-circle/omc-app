import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Joi from 'joi';
import request from 'supertest';
import { Account } from '../src/account/account.entity';
import { AccountModule } from '../src/account/account.module';
import { CreateAccountDto } from '../src/account/dto/create-account.dto';
import { ActivityRecordModule } from '../src/activity-record/activity-record.module';
import { Roles } from '../src/app.roles';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { ConfigModule } from '../src/config/config.module';
import { EmailModule } from '../src/email/email.module';
import { FileModule } from '../src/file/file.module';
import { Gender } from '../src/user/enums/gender.enum';
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
          validationSchema: Joi.object({
            SECRET: Joi.string().default('test-secret'),
            PAYPAL_SANDBOXED: Joi.boolean().default(true),
            EMAIL_SANDBOXED: Joi.boolean().default(true),
            EMAIL_TEMPLATE_VERIFY: Joi.string().default('VERIFY_TEMPLATE'),
            EMAIL_TEMPLATE_RESET: Joi.string().default('RESET_TEMPLATE'),
            UPLOAD_DIRECTORY: Joi.string().default('../../uploads'),
            DEFAULT_EVENT_PICTURE: Joi.string().default(
              '/defaults/neon-math.jpg',
            ),
            DEFAULT_AVATAR_FOLDER: Joi.string().default('/defaults/avatars'),
          }),
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        MikroOrmModule.forRoot(MikroORMTestingConfig),
        ActivityRecordModule,
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
      acc!.primaryUser.roles = [Roles.ADMIN];

      await orm.em.flush();

      expect(acc!.primaryUser.roles).toStrictEqual(['admin']);

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

  describe('POST /account', () => {
    it('should create new accounuts', async () => {
      const dto: CreateAccountDto = {
        first: 'Jake',
        last: 'Doe',
        email: 'jake@doe.com',
        omcEmail: 'jake@orlandomathcircle.org',
        roles: [Roles.ADMIN],
        gender: Gender.MALE,
        password: 'apple',
        dob: new Date(Date.UTC(2000, 0, 1)),
        industry: {
          profession: 'Fake Test Person',
        },
      };

      const resp = await request(app.getHttpServer())
        .post('/account')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(resp.body).toBeDefined();
      expect(resp.body.primaryUser.name).toBe('Jake Doe');
      expect(resp.body.primaryUser.omcEmail).toBe(dto.omcEmail);
    });
  });

  describe('GET /account/user/:id', () => {
    it('should retrieve an account by the primary user', async () => {
      const resp = await request(app.getHttpServer())
        .get('/account/user/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.id).toBe(1);
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
      const users = await orm.em.find(User, {}, ['account']);

      for (const user of users) {
        expect(user.account).not.toBeFalsy();
        expect(user.account.id).not.toBe(1);
      }
    });
  });
});
