import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from 'mikro-orm';
import request from 'supertest';
import MikroORMConfig from '../mikro-orm.config';
import { CreateAccountDTO } from '../src/accounts/dtos/create-account.dto';
import { AppModule } from '../src/app.module';

const { dbName, user, password, ...opts } = MikroORMConfig;

const createAccountDTO: CreateAccountDTO = {
  name: 'Jane Doe',
  email: 'jane@doe.com',
  password: 'apple',
  dob: new Date(),
};

describe('Accounts', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MikroORM)
      .useFactory({
        factory: async () => {
          orm = await MikroORM.init({
            dbName: 'omc_test',
            ...opts,
          });

          const generator = orm.getSchemaGenerator();

          await generator.ensureDatabase();
          await generator.dropSchema();
          await generator.createSchema();

          return orm;
        },
      })
      .overrideProvider(EntityManager)
      .useFactory({ factory: (orm: MikroORM) => orm.em, inject: [MikroORM] })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('/POST register', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send(createAccountDTO)
      .expect(201);
  });

  // it('/GET account', () => {
  //   return request(app.getHttpServer()).get('/account/1').expect(200);
  // });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });
});
