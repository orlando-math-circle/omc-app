import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { JsonWebTokenFilter } from './auth/filters/jwt.filter';
import { ConfigService } from './config/config.service';
import { MikroORMConstraintExceptionFilter } from './shared/errors/mikro-orm.exception';
import { SearchPipe } from './shared/pipes/search.pipe';
import { SortingPipe } from './shared/pipes/sorting.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config: ConfigService = app.get(ConfigService);

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

  if (config.FILES.SERVE_STATIC) {
    app.useStaticAssets(join(process.cwd(), config.FILES.UPLOAD_DIRECTORY));
  }

  app.enableCors();

  await app.listen(config.PORT);
}
bootstrap();
