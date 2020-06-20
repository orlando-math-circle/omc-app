import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Connection, IDatabaseDriver, MikroORM } from 'mikro-orm';
import request from 'supertest';
import { CreateAccountDTO } from '../src/account/dtos/create-account.dto';
import { Roles } from '../src/app.roles';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { User } from '../src/user/user.entity';
import { createMikroTestingModule } from './bootstrap';

describe('Users', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  let token: string;

  const createAccountDTO: CreateAccountDTO = {
    name: 'Jane Doe',
    email: 'jane@doe.com',
    password: 'apple',
    dob: new Date(),
  };

  const secondAccountDTO: CreateAccountDTO = {
    name: 'Jack Doe',
    email: 'jack@doe.com',
    password: 'banana',
    dob: new Date(),
  };

  beforeAll(async () => {
    const moduleRef = await createMikroTestingModule();

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
      .send(createAccountDTO)
      .expect(201);

    await request(app.getHttpServer())
      .post('/account/register')
      .send(secondAccountDTO)
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
