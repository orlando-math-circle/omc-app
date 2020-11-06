import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../app.constants';
import { User } from '../user/user.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(config: ConfigService) {
    SendGrid.setApiKey(config.get(SENDGRID_API_KEY));
  }

  async email(user: User, subject: string, message: string) {
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
        mailSettings: {
          sandboxMode: {
            enable: false,
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed: ${error}`);
    }
  }
}
