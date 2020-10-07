import { MikroORM } from '@mikro-orm/core';
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
import { UpdateCourseDto } from '../src/course/dto/update-course.dto';
import { LatePaymentType } from '../src/course/enums/late-payment-type.enum';
import { PaymentType } from '../src/course/enums/payment-type.enum';
import { CreateProjectDto } from '../src/project/dto/create-project.dto';
import { ProjectModule } from '../src/project/project.module';
import { MikroORMConstraintExceptionFilter } from '../src/shared/errors/mikro-orm.exception';
import { SearchPipe } from '../src/shared/pipes/search.pipe';
import { SortingPipe } from '../src/shared/pipes/sorting.pipe';
import { UserModule } from '../src/user/user.module';
import { UserFixtures } from './fixtures/user.fixture';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Courses', () => {
  let app: INestApplication;
  let orm: MikroORM;

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
        AccountModule,
        UserModule,
        AuthModule,
        CourseModule,
        ProjectModule,
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

  describe('POST /course', () => {
    it('should throw 401 for unauthenticated', async () => {
      await request(app.getHttpServer()).post('/course').expect(401);
    });

    it('should throw 403 for unauthorized users', async () => {
      await request(app.getHttpServer()).post('/course').expect(401);
    });

    it('should create a course', async () => {
      await userFixtures.setUserRoles(1, [Roles.ADMIN]);

      const createProjectDto: CreateProjectDto = {
        name: 'Test Project A',
        description: 'Example description.',
      };

      const project = await request(app.getHttpServer())
        .post('/project')
        .send(createProjectDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(project.body).toBeDefined();
      expect(project.body).toEqual({
        id: 1,
        name: 'Test Project A',
        description: 'Example description.',
        courses: [],
        events: [],
      });

      const createCourseDto: CreateCourseDto = {
        name: 'Test Course A',
        description: 'Example description.',
        paymentType: PaymentType.ALL,
        latePaymentType: LatePaymentType.DENY,
        fee: '12.34',
        project: 1,
      };

      const course = await request(app.getHttpServer())
        .post('/course')
        .send(createCourseDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(course.body).toBeDefined();
      expect(course.body).toEqual({
        id: 1,
        name: 'Test Course A',
        description: 'Example description.',
        paymentType: PaymentType.ALL,
        latePaymentType: LatePaymentType.DENY,
        fee: '12.34',
        events: [],
        invoices: [],
        project: 1,
      });
    });
  });

  describe('GET /course/:id', () => {
    it('should retrieve an individual course', async () => {
      const course = await request(app.getHttpServer())
        .get('/course/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(course.body).toBeDefined();
      expect(course.body).toEqual({
        id: 1,
        name: 'Test Course A',
        description: 'Example description.',
        paymentType: PaymentType.ALL,
        latePaymentType: LatePaymentType.DENY,
        fee: '12.34',
        lateFee: null,
        project: 1,
      });
    });

    it('should throw 404 on courses that do not exist', async () => {
      await request(app.getHttpServer())
        .get('/course/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /course', () => {
    it('should retrieve multiple courses and count them', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Test Course B',
        description: 'Example description.',
        paymentType: PaymentType.SINGLE,
        latePaymentType: LatePaymentType.DENY,
        fee: '43.21',
        project: 1,
      };

      await request(app.getHttpServer())
        .post('/course')
        .send(createCourseDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const courses = await request(app.getHttpServer())
        .get('/course')
        .expect(200);

      expect(courses.body).toBeDefined();
      expect(courses.body).toEqual([
        [
          {
            id: 1,
            name: 'Test Course A',
            description: 'Example description.',
            paymentType: PaymentType.ALL,
            latePaymentType: LatePaymentType.DENY,
            fee: '12.34',
            lateFee: null,
            project: 1,
          },
          {
            id: 2,
            name: 'Test Course B',
            description: 'Example description.',
            paymentType: PaymentType.SINGLE,
            latePaymentType: LatePaymentType.DENY,
            fee: '43.21',
            lateFee: null,
            project: 1,
          },
        ],
        2,
      ]);
    });

    it('should retrieve courses with fuzzy searching', async () => {
      const courses = await request(app.getHttpServer())
        .get('/course')
        .query({ contains: 'B' })
        .expect(200);

      expect(courses.body).toBeDefined();
      expect(courses.body).toEqual([
        [
          {
            id: 2,
            name: 'Test Course B',
            description: 'Example description.',
            paymentType: PaymentType.SINGLE,
            latePaymentType: LatePaymentType.DENY,
            fee: '43.21',
            lateFee: null,
            project: 1,
          },
        ],
        1,
      ]);
    });

    it('should paginate courses', async () => {
      const courses = await request(app.getHttpServer())
        .get('/course')
        .query({ limit: 20, offset: 1 })
        .expect(200);

      expect(courses.body).toBeDefined();
      expect(courses.body).toEqual([
        [
          {
            id: 2,
            name: 'Test Course B',
            description: 'Example description.',
            paymentType: PaymentType.SINGLE,
            latePaymentType: LatePaymentType.DENY,
            fee: '43.21',
            lateFee: null,
            project: 1,
          },
        ],
        2,
      ]);
    });
  });

  describe('PATCH /course', () => {
    it('should update a course', async () => {
      const updateCourseDto: UpdateCourseDto = {
        name: 'Test Course B - Updated',
        description: 'Example description updated.',
      };

      const course = await request(app.getHttpServer())
        .patch('/course/2')
        .send(updateCourseDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(course.body).toBeDefined();
      expect(course.body).toEqual({
        id: 2,
        name: updateCourseDto.name,
        description: updateCourseDto.description,
        paymentType: PaymentType.SINGLE,
        latePaymentType: LatePaymentType.DENY,
        fee: '43.21',
        lateFee: null,
        project: 1,
      });
    });
  });

  describe('DELETE /course', () => {
    it('should delete a course', async () => {
      await request(app.getHttpServer())
        .delete('/course/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should throw 404 on attempting to delete a course that does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/course/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
