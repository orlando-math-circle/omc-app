import * as Joi from '@hapi/joi';

const configSchema = Joi.object({
  SECRET: Joi.string().default('EXAMPLE'),
  USE_RRULE_CACHE: Joi.boolean().default(false),
});

export default configSchema;
