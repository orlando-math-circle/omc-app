import { BaseEntity, Options, ReflectMetadataProvider } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config: Options = {
  type: 'postgresql',
  entities: [BaseEntity, 'dist/**/*.entity.js'],
  entitiesTs: [BaseEntity, 'src/**/*.entity.ts'],
  dbName: process.env.DATABASE_NAME || 'omc',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} not found`);
  },
  forceUtcTimezone: true,
  // debug: process.env.NODE_ENV === 'development',
  debug: true,
};

export default config;
