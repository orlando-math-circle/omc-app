import Joi from '@hapi/joi';
import {
  DEFAULT_AVATAR_FOLDER,
  DEFAULT_EVENT_PICTURE,
  FILE_DIRECTORY,
  FORM_SUBDIRECTORY,
  PAYPAL_CLIENT_ID,
  PAYPAL_SANDBOXED,
  PAYPAL_SECRET_KEY,
  SENDGRID_API_KEY,
  SERVE_STATIC,
} from './app.constants';

const configSchema = Joi.object({
  SECRET: Joi.string().required(),
  USE_RRULE_CACHE: Joi.boolean().default(false),
  [PAYPAL_SANDBOXED]: Joi.boolean().default(true),
  [PAYPAL_CLIENT_ID]: Joi.string().required(),
  [PAYPAL_SECRET_KEY]: Joi.string().required(),
  [FILE_DIRECTORY]: Joi.string().required(),
  [FORM_SUBDIRECTORY]: Joi.string().default('form'),
  [SENDGRID_API_KEY]: Joi.string().required(),
  [SERVE_STATIC]: Joi.boolean().default(false),
  [DEFAULT_EVENT_PICTURE]: Joi.string().default('/defaults/neon-math.jpg'),
  [DEFAULT_AVATAR_FOLDER]: Joi.string().default('/defaults/avatars'),
});

const testSchema = Joi.object({
  SECRET: Joi.string().default('TESTING_SECRET'),
  PAYPAL_SANDBOXED: Joi.boolean().default(true),
  FILE_DIRECTORY: Joi.string().default('../../files'),
});

export { configSchema, testSchema };
export default configSchema;
