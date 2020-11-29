import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PersonalizationData } from '@sendgrid/helpers/classes/personalization';
import SendGrid from '@sendgrid/mail';
import { SENDGRID_API_KEY, SENDGRID_IN_DEV } from '../app.constants';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private isSandbox: boolean;

  constructor(private readonly config: ConfigService) {
    this.initSendGrid();
  }

  /**
   * Configures SendGrid with the API key or switches to
   * our lazy "SandBox" mode.
   */
  private initSendGrid() {
    const override = this.config.get<boolean>(SENDGRID_IN_DEV);

    this.isSandbox = !override && this.config.get('NODE_END') !== 'production';

    if (this.isSandbox) {
      this.logger.log('Emailing in sandbox mode for development');
    } else {
      this.logger.log('Enabling SendGrid');
      SendGrid.setApiKey(this.config.get(SENDGRID_API_KEY));
    }
  }

  /**
   * Sends an email or emails using the SendGrid API
   *
   * @param users Personalization data
   */
  async email(
    users: PersonalizationData | PersonalizationData[],
    subject: string,
    html?: string,
    template_id?: string,
    templateData?: Record<string, any>,
  ) {
    // eslint-disable-next-line prefer-rest-params
    if (this.isSandbox) return this.sandbox(...arguments);

    try {
      await SendGrid.send({
        personalizations: Array.isArray(users) ? users : [users],
        from: {
          name: 'Orlando Math Circle',
          email: 'info@omc.gilberts.dev',
        },
        subject,
        html: html || undefined,
        templateId: template_id,
        dynamicTemplateData: templateData,
      });
    } catch (error) {
      this.logger.error(`Failed: ${error}`);
    }
  }

  private sandbox(...args: any) {
    this.logger.log(args);
  }
}
