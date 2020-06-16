import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, MikroORM } from 'mikro-orm';
import MikroORMConfig from '../mikro-orm.config';
import { AppModule } from '../src/app.module';

// FIXME: Inelegant. This should be configurable for local testing.
delete MikroORMConfig.user;
delete MikroORMConfig.password;
MikroORMConfig.dbName = 'omc_test';

export async function createMikroTestingModule(): Promise<TestingModule> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MikroORM)
    .useFactory({
      factory: async () => {
        return await MikroORM.init(MikroORMConfig);
      },
    })
    .overrideProvider(EntityManager)
    .useFactory({ factory: (orm: MikroORM) => orm.em, inject: [MikroORM] })
    .compile();

  return moduleRef;
}
