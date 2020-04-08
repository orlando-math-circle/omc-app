import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import passport from 'passport';
import redis from 'redis';
import { AppModule } from './app.module';
import { TypeORMExceptionFilter } from './filters/typeorm.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

  // Redis Session Store
  // const redisClient = redis.createClient();
  // const RedisStore = require('connect-redis')(session);

  app.use(
    session({
      secret: config.get('AUTH_SECRET'),
      name: 'omc.token',
      resave: false,
      saveUninitialized: false,
      // store: new RedisStore({ client: redisClient }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true, // Throws an error on unexpected properties
      transform: false,
    }),
  );

  app.useGlobalFilters(new TypeORMExceptionFilter());

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
