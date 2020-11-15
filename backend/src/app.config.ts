import Joi from '@hapi/joi';

const configSchema = Joi.object({
  SECRET: Joi.string().required(),
  USE_RRULE_CACHE: Joi.boolean().default(false),
  PAYPAL_SANDBOXED: Joi.boolean().default(true),
  PAYPAL_CLIENT_ID: Joi.string().required(),
  PAYPAL_SECRET_KEY: Joi.string().required(),
  FILE_DIRECTORY: Joi.string().required(),
  FORM_SUBDIRECTORY: Joi.string().default('form'),
  SENDGRID_API_KEY: Joi.string().required(),
  SERVE_STATIC: Joi.boolean().default(false),
});

const testSchema = Joi.object({
  SECRET: Joi.string().default('TESTING_SECRET'),
  PAYPAL_SANDBOXED: Joi.boolean().default(true),
  FILE_DIRECTORY: Joi.string().default('../../files'),
});

export { configSchema, testSchema };
export default configSchema;
