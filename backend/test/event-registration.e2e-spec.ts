import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AccountModule } from '../src/account/account.module';
import { CreateAccountDto } from '../src/account/dtos/create-account.dto';
import { testSchema } from '../src/app.config';
import { Roles } from '../src/app.roles';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { EmailModule } from '../src/email/email.module';
import { EventRegistrationModule } from '../src/event-registration/event-registration.module';
import { CreateEventDto } from '../src/event/dtos/create-event.dto';
import { InvoiceModule } from '../src/invoice/invoice.module';
import { PayPalModule } from '../src/paypal/paypal.module';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Event Registrations', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  let token: string;
  let adminToken: string;

  const createAccountDto: CreateAccountDto = {
    first: 'Jane',
    last: 'Doe',
    email: 'jane@doe.com',
    password: 'apple',
    dob: new Date(),
  };

  const createAdminAccountDto: CreateAccountDto = {
    first: 'John',
    last: 'Doe',
    email: 'john@doe.com',
    password: 'apple',
    dob: new Date(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
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
        PayPalModule,
        InvoiceModule,
        EventRegistrationModule,
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

    const loginResp = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'jane@doe.com', password: 'apple' })
      .expect(201);

    expect(typeof loginResp.body.token).toBe('string');
    token = loginResp.body.token;

    await request(app.getHttpServer())
      .post('/account/register')
      .send(createAdminAccountDto)
      .expect(201);

    const adminLoginResp = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'john@doe.com', password: 'apple' })
      .expect(201);

    expect(typeof adminLoginResp.body.token).toBe('string');
    adminToken = adminLoginResp.body.token;

    const user = await orm.em.findOneOrFail(User, 2);

    user.roles = [Roles.ADMIN];

    await orm.em.flush();
  });

  afterEach(() => {
    orm.em.clear();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe('POST /order/create/:id', () => {
    it('should throw insufficient permissions', async () => {
      await request(app.getHttpServer())
        .post('/registration/order/create/1')
        .expect(401);

      await request(app.getHttpServer())
        .post('/registration/order/create/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should throw 404 Not Found for unknown event ids', async () => {
      // Upgrade to parent-level permissions.
      const user = await orm.em.findOneOrFail(User, 1);
      user.roles = [Roles.PARENT];
      await orm.em.flush();

      await request(app.getHttpServer())
        .post('/registration/order/create/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it.skip('should generate a PayPal order', async () => {
      const eventDto: CreateEventDto = {
        name: 'Event',
        dtstart: new Date(Date.UTC(2020, 11, 25)),
        dtend: new Date(Date.UTC(2020, 11, 25, 2, 30)),
        fee: '15.75',
      };

      // Generate an event with the admin account.
      await request(app.getHttpServer())
        .post('/event')
        .send(eventDto)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      const resp = await request(app.getHttpServer())
        .post('/registration/order/create/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      console.log(resp.body);
    });
  });
});
