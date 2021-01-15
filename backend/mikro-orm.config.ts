import { BaseEntity, Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { NotFoundException } from '@nestjs/common';
import dotenv from 'dotenv';
import { UserSubscriber } from './src/user/user.subscriber';

dotenv.config();

export const config: Options = {
  type: 'postgresql',
  entities: [BaseEntity, 'dist/**/*.entity.js'],
  entitiesTs: [BaseEntity, 'src/**/*.entity.ts'],
  subscribers: [
    new UserSubscriber(),
    // new FileSubscriber() disabled for now.
  ],
  dbName: process.env.DATABASE_NAME || 'omc',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  cache: { enabled: process.env.DATABASE_CACHE === 'true' },
  driverOptions: {
    connection: {
      ssl: process.env.DATABASE_SSL === 'true' || false
    }
  },
  migrations: {
    disableForeignKeys: false
  },
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} not found`);
  },
  forceUtcTimezone: true,
  debug: process.env.DATABASE_DEBUG === 'true',
  highlighter: new SqlHighlighter(),
};

export default config;
