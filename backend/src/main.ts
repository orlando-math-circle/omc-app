import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigSchema } from './app.config';
import { AppModule } from './app.module';
import { JsonWebTokenFilter } from './auth/filters/jwt.filter';
import { MikroORMConstraintExceptionFilter } from './shared/errors/mikro-orm.exception';
import { SearchPipe } from './shared/pipes/search.pipe';
import { SortingPipe } from './shared/pipes/sorting.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config: ConfigService<ConfigSchema> = app.get(ConfigService);

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
    new SearchPipe(),
    new SortingPipe(),
  );

  app.useGlobalFilters(
    new JsonWebTokenFilter(),
    new MikroORMConstraintExceptionFilter(),
  );

  if (config.get('SERVE_STATIC')) {
    app.useStaticAssets(join(process.cwd(), config.get('FILE_DIRECTORY')));
  }

  app.enableCors();

  await app.listen(config.get('PORT'));
}
bootstrap();
