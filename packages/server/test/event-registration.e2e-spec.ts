import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Joi from 'joi';
import request from 'supertest';
import { AccountModule } from '../src/account/account.module';
import { ActivityRecordModule } from '../src/activity-record/activity-record.module';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { ConfigModule } from '../src/config/config.module';
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
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Event Registrations', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  // let userFixtures: UserFixtures;
  // let token: string;

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
        ActivityRecordModule,
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

    // userFixtures = new UserFixtures(app, orm);

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

    // Commented to avoid linting errors until these tests are written.
    // token = await userFixtures.createAccount();
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
