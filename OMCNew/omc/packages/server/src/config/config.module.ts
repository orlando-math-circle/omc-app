import { DynamicModule, Logger, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';
import { CONFIGURATION_TOKEN } from './config.constants';
import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './interfaces/config-module-options.interface';

@Module({})
export class ConfigModule {
  private static readonly logger = new Logger(ConfigModule.name);

  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    let validatedEnvConfig: Record<string, any> | undefined = undefined;
    let config = options.ignoreEnvFile ? {} : this.loadEnvFile(options);

    if (!options.ignoreEnvFile) {
      config = {
        ...config,
        ...process.env,
      };
    }

    if (options.validationSchema) {
      const validationOptions = this.getSchemaValidationOptions(options);

      const { error, value: validatedConfig } =
        options.validationSchema.validate(config, validationOptions);

      if (error) {
        const message = [
          'Failed to start the application due to a configuration issue. Please check the .env file.',
          error.details.map((d) => `\t ${d.message}`),
        ];

        this.logger.error(message.join('\n'));
        process.exit(1);
      }

      validatedEnvConfig = validatedConfig;
      this.assignVariablesToProcess(validatedConfig);
    } else {
      this.assignVariablesToProcess(config);
    }

    const configProvider = {
      provide: CONFIGURATION_TOKEN,
      useValue: validatedEnvConfig || {},
    };

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: [ConfigService, configProvider],
      exports: [ConfigService, configProvider],
    };
  }

  private static loadEnvFile(
    options: ConfigModuleOptions,
  ): Record<string, any> {
    const envFilePaths = Array.isArray(options.envFilePath)
      ? options.envFilePath
      : [options.envFilePath || resolve(process.cwd(), '.env')];

    let config: ReturnType<typeof dotenv.parse> = {};

    for (const envFilePath of envFilePaths) {
      if (fs.existsSync(envFilePath)) {
        config = Object.assign(
          dotenv.parse(fs.readFileSync(envFilePath)),
          config,
        );
      }
    }

    return config;
  }

  private static assignVariablesToProcess(config: Record<string, any>) {
    if (config === null || typeof config !== 'object') {
      return;
    }

    const keys = Object.keys(config).filter((key) => !(key in process.env));
    keys.forEach((key) => (process.env[key] = config[key]));
  }

  private static getSchemaValidationOptions(options: ConfigModuleOptions) {
    if (options.validationOptions) {
      if (typeof options.validationOptions.allowUnknown === 'undefined') {
        options.validationOptions.allowUnknown = true;
      }

      return options.validationOptions;
    }

    return {
      abortEarly: false,
      allowUnknown: true,
    };
  }
}
