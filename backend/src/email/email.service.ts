import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../app.constants';
import { User } from '../user/user.entity';

@Injectable()
export class EmailService {
  private readonly sandbox: boolean;
  private readonly logger = new Logger(EmailService.name);

  constructor(config: ConfigService) {
    this.sandbox = config.get('NODE_ENV') !== 'production';

    if (this.sandbox) {
      this.logger.log('Emailing in sandbox mode for development');
      return;
    }

    SendGrid.setApiKey(config.get(SENDGRID_API_KEY));
  }

  async email(user: User, subject: string, message: string) {
    if (this.sandbox) {
      this.logger.log(
        `Sending to ${user.name}, subject: ${subject}, body: ${message}`,
      );
      return;
    }

    try {
      await SendGrid.send({
        to: {
          name: user.name,
          email: user.email,
        },
        from: {
          name: 'Orlando Math Circle',
          email: 'test@omc.gilberts.dev',
        },
        subject: subject,
        html: message,
      });
    } catch (error) {
      this.logger.error(`Failed: ${error}`);
    }
  }
}
