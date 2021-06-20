import Joi from 'joi';

/**
 * ConfigSchema
 *
 * Note: Some services may utilize `process.env` without type checking.
 * Changing the names of variables should be done carefully.
 */

export interface ConfigSchema extends Record<string, any> {
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_NAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASS: string;
  PORT: number;
  SECRET: string;
  FRONTEND_URL: string;
  ADMIN_EMAIL: string;
  PAYPAL_SANDBOXED: boolean;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET_KEY: string;
  EMAIL_SANDBOXED: boolean;
  EMAIL_KEY: string;
  EMAIL_TEMPLATE_VERIFY: string;
  EMAIL_TEMPLATE_RESET: string;
  EMAIL_TEMPLATE_REMIND: string;
  UPLOAD_DIRECTORY: string;
  FORM_SUBDIRECTORY: string;
  SERVE_STATIC: boolean;
  DEFAULT_EVENT_PICTURE: string;
  DEFAULT_AVATAR_FOLDER: string;
  TWITTER_KEY: string;
  TWITTER_SECRET: string;
}

export const configSchema = Joi.object<ConfigSchema>({
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
  EMAIL_SANDBOXED: Joi.boolean().default(true),
  EMAIL_KEY: Joi.when('EMAIL_SANDBOXED', {
    is: false,
    then: Joi.string().required(),
    otherwise: Joi.string(),
  }),
  EMAIL_TEMPLATE_VERIFY: Joi.string().default('0p7kx4xo6249yjre'),
  EMAIL_TEMPLATE_RESET: Joi.string().default('x2p0347m2k4zdrn7'),
  EMAIL_TEMPLATE_REMIND: Joi.string().default(''),
  EMAIL_TEMPLATE_CHANGE_EMAIL: Joi.string().default('pr9084zjeegw63dn'),
  UPLOAD_DIRECTORY: Joi.string().default('../../../uploads'),
  FORM_SUBDIRECTORY: Joi.string().default('form'),
  SERVE_STATIC: Joi.boolean().default(true),
  STATIC_BASE: Joi.string().default('http://localhost:3000'),
  AVATAR_BASE: Joi.string().default('/defaults/avatars'),
  DEFAULT_EVENT_PICTURE: Joi.string().default('/defaults/neon-math.jpg'),
  DEFAULT_AVATAR_FOLDER: Joi.string().default('/defaults/avatars'),
});
