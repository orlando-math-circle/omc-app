import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import { Email } from './email.class';
import { SENDGRID_TOKEN } from './email.constants';
import { EmailSandbox } from './email.sandbox';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(SENDGRID_TOKEN)
    private readonly mailer: MailService | EmailSandbox,
  ) {}

  /**
   * Sends an email object to the provided user(s) using SendGrid.
   *
   * @param email Email class.
   */
  public async send(email: Email) {
    try {
      await this.mailer.send(email.toSendGridRequest());
    } catch (error) {
      this.logger.error(`Failed: ${error}`);
    }
  }
}
