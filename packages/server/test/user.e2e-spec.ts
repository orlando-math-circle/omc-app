import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '../src/config/config.module';
import { Test } from '@nestjs/testing';
import Joi from 'joi';
import request from 'supertest';
import { Account } from '../src/account/account.entity';
import { AccountModule } from '../src/account/account.module';
import { RegisterAccountDto } from '../src/account/dto/register.dto';
import { Roles } from '../src/app.roles';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { EmailModule } from '../src/email/email.module';
import { FileModule } from '../src/file/file.module';
import { CreateUserDto } from '../src/user/dtos/create-user.dto';
import { UpdateUserDto } from '../src/user/dtos/update-user.dto';
import { Gender } from '../src/user/enums/gender.enum';
import { Grade } from '../src/user/enums/grade.enum';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Users', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  let token: string;

  const createAccountDto: RegisterAccountDto = {
    first: 'Jane',
    last: 'Doe',
    grade: Grade.GRADUATED,
    gender: Gender.FEMALE,
    email: 'jane@doe.com',
    password: 'apple',
    dob: new Date(Date.UTC(1995, 0, 1)),
  };

  const secondAccountDto: RegisterAccountDto = {
    first: 'Jack',
    last: 'Doe',
    gender: Gender.FEMALE,
    grade: Grade.GRADUATED,
    email: 'jack@doe.com',
    password: 'banana',
    dob: new Date(Date.UTC(1995, 0, 1)),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
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
        EmailModule,
        AccountModule,
        UserModule,
        FileModule,
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
      const dto: CreateUserDto = {
        first: 'First',
        last: 'Last',
        gender: Gender.MALE,
        dob: new Date(Date.UTC(1995, 0, 1)),
      };

      await request(app.getHttpServer())
        .post('/user')
        .send(dto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const account = await orm.em.findOne(Account, { id: 1 }, true);

      const addedUser = orm.em.getReference(User, 3);
      expect(account).toBeDefined();
      expect(account!.users.length).toBe(2);
      expect(account!.users.contains(addedUser)).toBe(true);
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
      expect(user!.id).toBe(1);

      user!.roles = [Roles.ADMIN];

      await orm.em.flush();

      const dto: UpdateUserDto = {
        first: 'Jackson',
        last: 'Doe',
      };

      await request(app.getHttpServer())
        .patch('/user/2')
        .send(dto)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const modUser = await orm.em.findOne(User, { id: 2 });

      expect(modUser).toBeDefined();
      expect(modUser!.id).toBe(2);
      expect(modUser!.first).toBe('Jackson');

      user!.roles = [];

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
      expect(user!.id).toBe(1);

      user!.roles = [Roles.ADMIN];

      await orm.em.flush();

      const toDelete = await orm.em.findOne(User, { id: 2 });

      expect(toDelete).toBeDefined();
      expect(toDelete!.id).toBe(2);

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
