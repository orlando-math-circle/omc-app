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
  dbName: process.env.DATABASE_NAME || 'omc',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} not found`);
  },
  debug: false,
};

export default config;
