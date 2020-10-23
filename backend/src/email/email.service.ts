import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../app.constants';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(config: ConfigService) {
    SendGrid.setApiKey(config.get(SENDGRID_API_KEY));
  }

  async email(context: string, email: string, message: string) {
    try {
      await SendGrid.send({
        to: email,
        from: 'test@omc.gilberts.dev',
        subject: 'Testing Email',
        text: message,
        mailSettings: {
          sandboxMode: {
            enable: true,
          },
        },
      });

      this.logger.verbose(`${context} Success`);
    } catch (error) {
      this.logger.error(`${context} Failed: ${error}`);
    }
  }
}
