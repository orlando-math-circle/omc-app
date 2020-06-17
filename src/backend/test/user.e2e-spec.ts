import { INestApplication } from '@nestjs/common';
import { Connection, IDatabaseDriver, MikroORM } from 'mikro-orm';
import * as request from 'supertest';
import { CreateAccountDTO } from '../src/account/dtos/create-account.dto';
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

  beforeAll(async () => {
    const moduleRef = await createMikroTestingModule();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);

    const generator = orm.getSchemaGenerator();
    await generator.ensureDatabase();
    await generator.dropSchema();
    await generator.createSchema();

    await app.init();

    /**
     * Seeding Data
     */

    await request(app.getHttpServer())
      .post('/account/register')
      .send(createAccountDTO)
      .expect(201);

    const loginResp = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'jane@doe.com', password: 'apple' })
      .expect(201);

    expect(typeof loginResp.body.token).toBe('string');
    token = loginResp.body.token;
  });

  describe('GET /me', () => {
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

  afterAll(async () => {
    await orm.close();
    await app.close();
  });
});
