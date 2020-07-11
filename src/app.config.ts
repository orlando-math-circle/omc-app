import * as Joi from '@hapi/joi';

const configSchema = Joi.object({
  SECRET: Joi.string().default('EXAMPLE'),
});

export default configSchema;
