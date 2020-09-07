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
import { EventRecurrence } from '../src/event/event-recurrence.entity';
import { Event } from '../src/event/event.entity';
import { Invoice } from '../src/invoice/invoice.entity';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';

delete MikroORMConfig.user;
delete MikroORMConfig.password;
delete MikroORMConfig.entitiesTs;

MikroORMConfig.debug = false;
MikroORMConfig.dbName = 'omc_test';
MikroORMConfig.entities = [Account, User, Invoice, Event, EventRecurrence];

describe('Users', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

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

  const secondAccountDto: CreateAccountDto = {
    name: 'Jack Doe',
    email: 'jack@doe.com',
    password: 'banana',
    dob: new Date(),
  };

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

    /**
     * Seeding Data
     */

    await request(app.getHttpServer())
      .post('/account/register')
      .send(createAccountDto)
      .expect(201);

    await request(app.getHttpServer())
      .post('/account/register')
      .send(secondAccountDto)
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
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe('POST /user', () => {
    it('should add a user to an account', async () => {
      await request(app.getHttpServer())
        .post('/user')
        .send({ name: 'First Last', dob: new Date() })
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const account = await orm.em.findOne(Account, { id: 1 }, true);

      const addedUser = orm.em.getReference(User, 3);
      expect(account).toBeDefined();
      expect(account.users.length).toBe(2);
      expect(account.users.contains(addedUser)).toBe(true);
    });
  });

  describe('GET /user/me', () => {
    it('should retrieve the selected user', async () => {
      const resp = await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resp.body.id).toBe(1);
      expect(resp.body.email).toBe('jane@doe.com');
      expect(resp.body.password).not.toBe('apple');
    });
  });

  describe('PATCH /user/:id', () => {
    it('should throw 403 for users without proper rank', async () => {
      await request(app.getHttpServer())
        .patch('/user/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should allow edits from qualified users', async () => {
      const user = await orm.em.findOne(User, { id: 1 });

      expect(user).toBeDefined();
      expect(user.id).toBe(1);

      user.roles = [Roles.ADMIN];

      await orm.em.flush();

      await request(app.getHttpServer())
        .patch('/user/2')
        .send({ name: 'Jackson Doe' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const modUser = await orm.em.findOne(User, { id: 2 });

      expect(modUser).toBeDefined();
      expect(modUser.id).toBe(2);
      expect(modUser.name).toBe('Jackson Doe');

      user.roles = [];

      await orm.em.flush();
    });
  });

  describe('DELETE /user/:id', () => {
    it('should fail to delete a user without a proper rank', async () => {
      await request(app.getHttpServer())
        .delete('/user/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should delete a user', async () => {
      const user = await orm.em.findOne(User, { id: 1 });

      expect(user).toBeDefined();
      expect(user.id).toBe(1);

      user.roles = [Roles.ADMIN];

      await orm.em.flush();

      const toDelete = await orm.em.findOne(User, { id: 2 });

      expect(toDelete).toBeDefined();
      expect(toDelete.id).toBe(2);

      await request(app.getHttpServer())
        .delete('/user/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      orm.em.clear();

      const deleted = await orm.em.findOne(User, { id: 2 });

      expect(deleted).toBeNull();
    });
  });
});
