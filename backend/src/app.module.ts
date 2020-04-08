import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { AccountModule } from './accounts/account.module';
import configSchema from './config/config.schema';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ProjectModule } from './projects/project.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve('../.env'),
      isGlobal: true,
      validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    AccountModule,
    ProjectModule,
  ],
})
export class AppModule {}
