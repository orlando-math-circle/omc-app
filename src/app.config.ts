import Joi from '@hapi/joi';

const configSchema = Joi.object({
  SECRET: Joi.string().default('TESTING_SECRET'),
  USE_RRULE_CACHE: Joi.boolean().default(false),
});

export default configSchema;
