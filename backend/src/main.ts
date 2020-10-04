import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { PORT } from './app.constants';
import { AppModule } from './app.module';
import { JsonWebTokenFilter } from './auth/filters/jwt.filter';
import { MikroORMConstraintExceptionFilter } from './shared/errors/mikro-orm.exception';
import { SearchPipe } from './shared/pipes/search.pipe';
import { SortingPipe } from './shared/pipes/sorting.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

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

  app.enableCors();

  await app.listen(config.get(PORT));
}
bootstrap();
