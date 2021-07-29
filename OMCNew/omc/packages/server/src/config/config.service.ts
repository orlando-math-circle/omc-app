import { Inject, Injectable } from '@nestjs/common';
import { CONFIGURATION_TOKEN } from './config.constants';
import { ConfigSchema } from './config.schema';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIGURATION_TOKEN)
    private readonly internalConfig: ConfigSchema,
  ) {}

  get isDev() {
    return this.internalConfig.NODE_ENV === 'development';
  }

  get PORT() {
    return this.internalConfig.PORT;
  }

  get SECRET() {
    return this.internalConfig.SECRET;
  }

  get ADMIN_EMAIL() {
    return this.internalConfig.ADMIN_EMAIL;
  }

  get DATABASE() {
    return {
      NAME: this.internalConfig.DATABASE_NAME,
      HOST: this.internalConfig.DATABASE_HOST,
      PORT: this.internalConfig.DATABASE_PORT,
      USER: this.internalConfig.DATABASE_USER,
      PASS: this.internalConfig.DATABASE_PASS,
    };
  }

  get PAYPAL() {
    return {
      SANDBOXED: this.internalConfig.PAYPAL_SANDBOXED,
      CLIENT_ID: this.internalConfig.PAYPAL_CLIENT_ID,
      SECRET_KEY: this.internalConfig.PAYPAL_SECRET_KEY,
    };
  }

  get MAILERSEND() {
    return {
      SANDBOXED: this.internalConfig.EMAIL_SANDBOXED,
      KEY: this.internalConfig.EMAIL_KEY,
      TEMPLATES: {
        VERIFY: this.internalConfig.EMAIL_TEMPLATE_VERIFY,
        RESET: this.internalConfig.EMAIL_TEMPLATE_RESET,
        CHANGE_EMAIL: this.internalConfig.EMAIL_TEMPLATE_CHANGE_EMAIL,
      },
    };
  }

  get TWITTER() {
    return {
      KEY: this.internalConfig.TWITTER_KEY,
      SECRET: this.internalConfig.TWITTER_SECRET,
    };
  }

  get FILES() {
    return {
      UPLOAD_DIRECTORY: this.internalConfig.UPLOAD_DIRECTORY,
      FRONTEND_URL: this.internalConfig.FRONTEND_URL,
      SERVE_STATIC: this.internalConfig.SERVE_STATIC,
      FORM_SUBDIRECTORY: this.internalConfig.FORM_SUBDIRECTORY,
      DEFAULT_EVENT_PICTURE: this.internalConfig.DEFAULT_EVENT_PICTURE,
      DEFAULT_AVATAR_FOLDER: this.internalConfig.DEFAULT_AVATAR_FOLDER,
    };
  }
}
