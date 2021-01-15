import { BaseEntity, Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { NotFoundException } from '@nestjs/common';
import dotenv from 'dotenv';
import path from 'path';
import { UserSubscriber } from './src/user/user.subscriber';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config: Options = {
  type: 'postgresql',
  entities: [BaseEntity, 'dist/**/*.entity.js'],
  entitiesTs: [BaseEntity, 'src/**/*.entity.ts'],
  subscribers: [
    new UserSubscriber(),
    // new FileSubscriber() disabled for now.
  ],
  dbName: process.env.DATABASE_NAME || 'omc',
  clientUrl: process.env.DATABASE_URL || undefined,
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  cache: { enabled: process.env.DATABASE_CACHE === 'true' },
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} not found`);
  },
  forceUtcTimezone: true,
  debug: process.env.DATABASE_DEBUG === 'true',
  highlighter: new SqlHighlighter(),
};

export default config;
