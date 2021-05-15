import { Logger } from '@nestjs/common';
import Joi from 'joi';

const logger = new Logger('Configuration');

export interface ConfigSchema extends Record<string, unknown> {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  SECRET: string;
  FRONTEND_URL: string;
  ADMIN_EMAIL: string;
  PAYPAL_SANDBOXED: boolean;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET_KEY: string;
  SENDGRID_SANDBOXED: boolean;
  SENDGRID_API_KEY: string;
  FILE_DIRECTORY: string;
  FORM_SUBDIRECTORY: string;
  SERVE_STATIC: boolean;
  DEFAULT_EVENT_PICTURE: string;
  DEFAULT_AVATAR_FOLDER: string;
}

const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  SECRET: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().min(10).required(),
    otherwise: Joi.string().default('dev-secret'),
  }),
  FRONTEND_URL: Joi.string().default('http://localhost:9000'),
  ADMIN_EMAIL: Joi.string().email(),
  PAYPAL_SANDBOXED: Joi.boolean().default(true),
  PAYPAL_CLIENT_ID: Joi.string().required(),
  PAYPAL_SECRET_KEY: Joi.string().required(),
  TWITTER_KEY: Joi.string(),
  TWITTER_SECRET: Joi.string(),
  SENDGRID_SANDBOXED: Joi.boolean().default(true),
  SENDGRID_API_KEY: Joi.when('SENDGRID_SANDBOXED', {
    is: false,
    then: Joi.string().required(),
    otherwise: Joi.string(),
  }),
  FILE_DIRECTORY: Joi.string().default('../../../uploads'),
  FORM_SUBDIRECTORY: Joi.string().default('form'),
  SERVE_STATIC: Joi.boolean().default(true),
  STATIC_BASE: Joi.string().default('http://localhost:3000'),
  AVATAR_BASE: Joi.string().default('/defaults/avatars'),
  DEFAULT_EVENT_PICTURE: Joi.string().default('/defaults/neon-math.jpg'),
  DEFAULT_AVATAR_FOLDER: Joi.string().default('/defaults/avatars'),
});

export function validate(config: Record<string, unknown>) {
  const validationResult = configSchema.validate(config, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });

  if (validationResult.error) {
    const message = [
      'Failed to start the application due to a configuration issue. Please check the .env file.\n',
      ...validationResult.error.details.map((d) => `\t ${d.message}`),
    ].join('\n');

    logger.error(message);
    process.exit(1);
  }

  return validationResult.value;
}
