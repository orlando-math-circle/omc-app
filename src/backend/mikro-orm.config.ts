import { NotFoundException } from '@nestjs/common';
import { Options, ReflectMetadataProvider } from 'mikro-orm';
import { Account } from './src/accounts/account.entity';
import { User } from './src/user/user.entity';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config: Options = {
  type: 'postgresql',
  entities: [Account, User],
  dbName: process.env.TESTDB_NAME || process.env.DATABASE_NAME,
  user: process.env.TESTDB_USER || process.env.DATABASE_USER,
  password: process.env.TESTDB_PASS || process.env.DATABASE_PASS,
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} not found`);
  },
  debug: true,
};

export default config;
