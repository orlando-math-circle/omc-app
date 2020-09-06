import Joi from '@hapi/joi';

const configSchema = Joi.object({
  SECRET: Joi.string().default('TESTING_SECRET'),
  USE_RRULE_CACHE: Joi.boolean().default(false),
  PAYPAL_SANDBOXED: Joi.boolean().default(true),
  PAYPAL_CLIENT_ID: Joi.string().required(),
  PAYPAL_SECRET_KEY: Joi.string().required(),
});

export default configSchema;
