import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      username: this.config.get('DATABASE_USERNAME'),
      password: this.config.get('DATABASE_PASSWORD'),
      database: this.config.get('DATABASE_DATABASE'),
      synchronize: this.config.get<boolean>('DATABASE_SYNCHRONIZE'),

      entities: [path.join(__dirname + '../../**/*.entity{.ts,.js}')],
      ssl: {
        // Postgres SSL Options: https://node-postgres.com/features/ssl
        rejectUnauthorized: true,
        // The root ca certificate for Amazon to connect RDS. Note that this expires August 22, 2024.
        // This certificate is ideally installed on the local machine.
        ca: this.config.get<boolean>('DATABASE_AMAZONCA')
          ? fs.readFileSync(
              path.resolve(
                __dirname,
                '../../src/config/certs/rds-combined-ca-bundle.pem',
              ),
            )
          : null,
      },
    };
  }
}
