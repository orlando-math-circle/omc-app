import Joi from 'joi';

export interface ConfigModuleOptions {
  /**
   * If "true", registers `ConfigModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;

  /**
   * If "true", envvironment files (`.env`) will be ignored.
   */
  ignoreEnvFile?: boolean;

  /**
   * Path to the environment file(s) to be loaded.
   */
  envFilePath?: string | string[];

  /**
   * Environment variables validation schema (Joi).
   */
  validationSchema?: Joi.ObjectSchema<any>;

  /**
   * Schema validation options.
   * https://joi.dev/api/?v=17.3.0#anyvalidatevalue-options
   */
  validationOptions?: Record<string, any>;
}
