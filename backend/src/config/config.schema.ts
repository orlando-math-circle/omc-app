import * as Joi from '@hapi/joi';

/**
 * This file describes the environment variables for the application.
 * Invalid or missing required variables will halt the startup process.
 */

const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  AUTH_SECRET: Joi.string().required(),
  JWT_EXPIRESIN: Joi.string().default('30 days'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DATABASE: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_AMAZONCA: Joi.boolean().default(true),
});

export default configSchema;
