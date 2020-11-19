import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AccountModule } from '../src/account/account.module';
import { testSchema } from '../src/app.config';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { CourseModule } from '../src/course/course.module';
import { EmailModule } from '../src/email/email.module';
import { EventRegistrationModule } from '../src/event-registration/event-registration.module';
import { EventModule } from '../src/event/event.module';
import { FileModule } from '../src/file/file.module';
import { ProjectModule } from '../src/project/project.module';
import { MikroORMConstraintExceptionFilter } from '../src/shared/errors/mikro-orm.exception';
import { SearchPipe } from '../src/shared/pipes/search.pipe';
import { SortingPipe } from '../src/shared/pipes/sorting.pipe';
import { UserModule } from '../src/user/user.module';
import { VolunteerJobModule } from '../src/volunteer-job/volunteer-job.module';
import { UserFixtures } from './fixtures/user.fixture';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Event Registrations', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  let userFixtures: UserFixtures;
  let token: string;

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
        FileModule,
        AuthModule,
        EventModule,
        CourseModule,
        ProjectModule,
        VolunteerJobModule,
        EventRegistrationModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);

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
      new SearchPipe(),
      new SortingPipe(),
    );

    app.useGlobalFilters(
      new JsonWebTokenFilter(),
      new MikroORMConstraintExceptionFilter(),
    );

    await app.init();

    /**
     * Seeding Data
     */

    token = await userFixtures.createAccount();
  });

  afterEach(() => {
    orm.em.clear();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe('Create Order', () => {
    it('should throw 401 for unauthenticated', async () => {
      await request(app.getHttpServer())
        .post('/registration/order/create/1')
        .expect(401);
    });
  });
});
