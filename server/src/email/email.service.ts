import { SqlEntityManager } from '@mikro-orm/knex';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import { User } from '../user/user.entity';
import { Email } from './email.class';
import { SENDGRID_TOKEN } from './email.constants';
import { EmailSandbox } from './email.sandbox';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(SENDGRID_TOKEN)
    private readonly mailer: MailService | EmailSandbox,
    private readonly em: SqlEntityManager,
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
      this.logger.error(error);
    }
  }

  /**
   * Sends multiple emails by user Ids.
   *
   * This uses the normal sending method under the hood.
   *
   * @param userIds User recipient identifiers.
   * @param subject Subject of the email.
   * @param body HTML or plain text of the email.
   */
  public async sendBulk(userIds: number[], subject: string, body: string) {
    const users = await this.em.find(User, {
      id: userIds,
      email: { $not: null },
    });

    const email = new Email(
      users.map((u) => u.email),
      subject,
      { html: body },
    );

    return this.send(email);
  }
}
