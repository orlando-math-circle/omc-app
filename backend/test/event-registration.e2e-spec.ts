import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AccountModule } from '../src/account/account.module';
import { testSchema } from '../src/app.config';
import { Roles } from '../src/app.roles';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { CourseModule } from '../src/course/course.module';
import { CreateCourseDto } from '../src/course/dto/create-course.dto';
import { LatePaymentType } from '../src/course/enums/late-payment-type.enum';
import { PaymentType } from '../src/course/enums/payment-type.enum';
import { EmailModule } from '../src/email/email.module';
import { EventRegistrationModule } from '../src/event-registration/event-registration.module';
import { EventModule } from '../src/event/event.module';
import { CreateProjectDto } from '../src/project/dto/create-project.dto';
import { ProjectModule } from '../src/project/project.module';
import { MikroORMConstraintExceptionFilter } from '../src/shared/errors/mikro-orm.exception';
import { SearchPipe } from '../src/shared/pipes/search.pipe';
import { SortingPipe } from '../src/shared/pipes/sorting.pipe';
import { UserModule } from '../src/user/user.module';
import { UserFixtures } from './fixtures/user.fixture';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe.only('Event Registrations', () => {
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
        AuthModule,
        EventModule,
        CourseModule,
        ProjectModule,
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

    it('should throw 403 for unauthorized users', async () => {
      await request(app.getHttpServer())
        .post('/registration/order/create/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should throw 400 for unknown account users on non-admins', async () => {
      await userFixtures.setUserRoles(1, [Roles.ADMIN]);

      const createProjectDto: CreateProjectDto = {
        name: 'TestProject',
        description: 'First Fixture',
      };

      const project = await request(app.getHttpServer())
        .post('/project')
        .send(createProjectDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(project.body).toBeDefined();
      expect(project.body).toEqual({
        id: 1,
        name: 'TestProject',
        description: 'First Fixture',
        courses: [],
        events: [],
      });

      const createCourseDto: CreateCourseDto = {
        name: `TestCourse:${new Date().getTime()}`,
        description: 'First Fixture',
        paymentType: PaymentType.ALL,
        latePaymentType: LatePaymentType.DENY,
        project: project.body.id,
        fee: '12.34',
      };

      const course = await request(app.getHttpServer())
        .post('/course')
        .send(createCourseDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(course.body).toBeDefined();
      expect(course.body).toEqual({
        id: 1,
        name: createCourseDto.name,
        description: 'First Fixture',
        paymentType: PaymentType.ALL,
        latePaymentType: LatePaymentType.DENY,
        project: 1,
        fee: '12.34',
        events: [],
        invoices: [],
      });
    });
  });
});
