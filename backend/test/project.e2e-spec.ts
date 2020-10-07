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
import { CreateProjectDto } from '../src/project/dto/create-project.dto';
import { FindAllProjectsDto } from '../src/project/dto/find-all-projects.dto';
import { UpdateProjectDto } from '../src/project/dto/update-project.dto';
import { ProjectModule } from '../src/project/project.module';
import { MikroORMConstraintExceptionFilter } from '../src/shared/errors/mikro-orm.exception';
import { SearchPipe } from '../src/shared/pipes/search.pipe';
import { SortingPipe } from '../src/shared/pipes/sorting.pipe';
import { UserModule } from '../src/user/user.module';
import { UserFixtures } from './fixtures/user.fixture';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Projects', () => {
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

  describe('POST /project', () => {
    it('should throw 401 for unauthenticated', async () => {
      await request(app.getHttpServer()).post('/project').expect(401);
    });

    it('should throw 403 for unauthorized users', async () => {
      await request(app.getHttpServer())
        .post('/project')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should create a project', async () => {
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
        name: createProjectDto.name,
        description: createProjectDto.description,
        courses: [],
        events: [],
      });
    });
  });

  describe('GET /project/:id', () => {
    it('should find a specific project', async () => {
      const project = await request(app.getHttpServer())
        .get('/project/1')
        .expect(200);

      expect(project.body).toBeDefined();
      expect(project.body).toEqual({
        id: 1,
        name: 'Test Project A',
        description: 'Example description.',
        picture: null,
      });
    });

    it('should throw 404 on projects that do not exist', async () => {
      await request(app.getHttpServer()).get('/project/2').expect(404);
    });
  });

  describe('GET /project', () => {
    it('should retrieve an array of projects and their count', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'Test Project B',
        description: 'Example description.',
      };

      const project = await request(app.getHttpServer())
        .post('/project')
        .send(createProjectDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(project.body).toBeDefined();
      expect(project.body).toEqual({
        id: 2,
        name: 'Test Project B',
        description: 'Example description.',
        courses: [],
        events: [],
      });

      const projects = await request(app.getHttpServer())
        .get('/project')
        .expect(200);

      expect(projects.body).toBeDefined();
      expect(projects.body).toEqual([
        [
          {
            id: 1,
            name: 'Test Project A',
            description: 'Example description.',
            picture: null,
          },
          {
            id: 2,
            name: 'Test Project B',
            description: 'Example description.',
            picture: null,
          },
        ],
        2,
      ]);
    });

    it('should retrieve an array of projects using fuzzy search', async () => {
      const projects = await request(app.getHttpServer())
        .get('/project')
        .query({ contains: 'B' })
        .expect(200);

      expect(projects.body).toBeDefined();
      expect(projects.body).toEqual([
        [
          {
            id: 2,
            name: 'Test Project B',
            description: 'Example description.',
            picture: null,
          },
        ],
        1,
      ]);
    });

    it('should should not fuzzy search with an empty contains string', async () => {
      const projects = await request(app.getHttpServer())
        .get('/project')
        .query({ contains: '' })
        .expect(200);

      expect(projects.body).toBeDefined();
      expect(projects.body).toEqual([
        [
          {
            id: 1,
            name: 'Test Project A',
            description: 'Example description.',
            picture: null,
          },
          {
            id: 2,
            name: 'Test Project B',
            description: 'Example description.',
            picture: null,
          },
        ],
        2,
      ]);
    });

    it('should sort projects', async () => {
      const findAllProjectsDto: FindAllProjectsDto = {
        sort: ['id:desc'],
      };

      const projects = await request(app.getHttpServer())
        .get('/project')
        .query(findAllProjectsDto)
        .expect(200);

      expect(projects.body).toBeDefined();
      expect(projects.body).toEqual([
        [
          {
            id: 2,
            name: 'Test Project B',
            description: 'Example description.',
            picture: null,
          },
          {
            id: 1,
            name: 'Test Project A',
            description: 'Example description.',
            picture: null,
          },
        ],
        2,
      ]);
    });

    it('should paginate projects', async () => {
      const findAllProjectsDto: FindAllProjectsDto = {
        limit: 20,
        offset: 1,
      };

      const projects = await request(app.getHttpServer())
        .get('/project')
        .query(findAllProjectsDto)
        .expect(200);

      expect(projects.body).toBeDefined();
      expect(projects.body).toEqual([
        [
          {
            id: 2,
            name: 'Test Project B',
            description: 'Example description.',
            picture: null,
          },
        ],
        2,
      ]);
    });
  });

  describe('PATCH /project', () => {
    it('should throw 401 on unauthenticated', async () => {
      await request(app.getHttpServer()).patch('/project/2').expect(401);
    });

    it('should throw 403 on unauthorized', async () => {
      await userFixtures.setUserRoles(1, [Roles.GUEST]);

      await request(app.getHttpServer())
        .patch('/project/2')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should update a project', async () => {
      await userFixtures.setUserRoles(1, [Roles.ADMIN]);

      const updateProjectDto: UpdateProjectDto = {
        name: 'Test Project B - Modified',
      };

      const project = await request(app.getHttpServer())
        .patch('/project/2')
        .send(updateProjectDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(project.body).toBeDefined();
      expect(project.body).toEqual({
        id: 2,
        name: updateProjectDto.name,
        description: 'Example description.',
        picture: null,
      });
    });
  });
});
