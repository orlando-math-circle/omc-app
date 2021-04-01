import { BadRequestException } from '@nestjs/common';
import { EmailData } from '@sendgrid/helpers/classes/email-address';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { PersonalizationData } from '@sendgrid/helpers/classes/personalization';
import { User } from '../user/user.entity';
import { EMAIL_SENDER_EMAIL, EMAIL_SENDER_NAME } from './email.constants';
import { EmailBody } from './interfaces/email-body.interface';
import { EmailReceiver } from './interfaces/email-receiver.interface';
import { EmailSender } from './interfaces/email-sender.interface';

export class Email {
  private html: string;
  private subject: string;
  private template: string;
  private templateData: Record<string, any>;
  private to: EmailData | EmailData[];
  private from: EmailSender;
  private personalizations: PersonalizationData[];

  /**
   * Instantiate a new Email.
   *
   * Used for constructing an email that can be sent to one or more
   * recipients.
   *
   * @param to Email or emails of the recipients.
   * @param subject Subject of the email.
   * @param body HTML or SendGrid template id and associated template variables.
   * @param sender Email and name of the email sender.
   */
  constructor(
    to: EmailReceiver,
    subject: string,
    body: EmailBody,
    sender: EmailSender = {
      name: EMAIL_SENDER_NAME,
      email: EMAIL_SENDER_EMAIL,
    },
  ) {
    if (to instanceof Array) {
      if (to.length === 0) {
        throw new BadRequestException('No email recipients in constructor');
      }

      if (typeof to[0] === 'string') {
        this.setEmails(to as string[]);
      } else if (to[0] instanceof User) {
        this.setUsers(to as User[]);
      } else {
        this.setPersonalizations(to as PersonalizationData[]);
      }
    } else if (typeof to === 'string') {
      this.setEmail(to);
    } else if (to instanceof User) {
      this.setUser(to);
    } else {
      this.setPersonalization(to);
    }

    this.subject = subject;

    if ('html' in body) {
      this.setHTML(body.html);
    } else {
      this.setTemplate(body.templateId, body.templateData);
    }

    this.from = sender;
  }

  /**
   * Sets the email recipient to a single user.
   *
   * Replaces any personalization data.
   *
   * @param user User
   */
  public setUser(user: User) {
    if (!user.email) {
      throw new BadRequestException('User does not have an email');
    }

    this.to = user.email;
    this.personalizations = undefined;
  }

  /**
   * Sets the email recipient to an array of users.
   *
   * Replaces any personalization data.
   *
   * @param users User array.
   */
  public setUsers(users: User[]) {
    this.to = users.filter((u) => !!u.email).map((u) => ({ email: u.email }));
    this.personalizations = undefined;
  }

  /**
   * Sets the email of the recipient.
   *
   * Replaces any personalization data.
   *
   * @param email Email address.
   */
  public setEmail(email: string) {
    this.to = email;
    this.personalizations = undefined;
  }

  /**
   * Sets the email of the recipients.
   *
   * Replaces any personalization data.
   *
   * @param emails Email addresses.
   */
  public setEmails(emails: string[]) {
    this.to = emails.map((e) => ({ email: e }));
    this.personalizations = undefined;
  }

  /**
   * Sets the personalization data for a single recipient.
   *
   * Replaces the user(s) or email(s) stored.
   *
   * @see [SendGrid Personalizations](https://sendgrid.com/docs/for-developers/sending-email/personalizations/)
   *
   * @param personalizations Personalization Data.
   */
  public setPersonalizations(personalizations: PersonalizationData[]) {
    this.personalizations = personalizations;
    this.to = undefined;
  }

  /**
   * Sets the personalization data for the recipients.
   *
   * Replaces the user(s) or email(s) stored.
   *
   * @see [SendGrid Personalizations](https://sendgrid.com/docs/for-developers/sending-email/personalizations/)
   *
   * @param personalizations Personalization Data.
   */
  public setPersonalization(personalization: PersonalizationData) {
    this.personalizations = [personalization];
    this.to = undefined;
  }

  /**
   * Sets the email HTML.
   *
   * Replaces any stored template data.
   *
   * @param html HTML body of the email.
   */
  public setHTML(html: string) {
    this.html = html;
    this.template = undefined;
    this.templateData = undefined;
  }

  /**
   * Sets the SendGrid email template.
   *
   * Replaces any stored HTML data.
   *
   * @param id SendGrid template id.
   * @param data Optional SendGrid template variables.
   */
  public setTemplate(id: string, data?: Record<string, any>) {
    this.template = id;
    this.templateData = data;
    this.html = undefined;
  }

  /**
   * Sets the subject of the email.
   *
   * @param subject Email subject.
   */
  public setSubject(subject: string) {
    this.subject = subject;
  }

  /**
   * Ensures the email is fully qualified and ready for sending.
   *
   * @throws {BadRequestException} Throws if the email is not qualified.
   */
  public validate() {
    if (!this.to && !this.personalizations) {
      throw new BadRequestException('Email lacks recipient(s)');
    }

    if (!this.from) {
      throw new BadRequestException('Email lacks sender');
    }

    if (!this.html && !this.template) {
      throw new BadRequestException('Email lacks HTML and template');
    }
  }

  /**
   * Builds a SendGrid request for the email.
   *
   * @returns SendGrid email request data.
   */
  public toSendGridRequest(): MailDataRequired {
    this.validate();

    return {
      to: this.to || undefined,
      personalizations: this.personalizations || undefined,
      from: this.from,
      subject: this.subject,
      html: this.html || undefined,
      templateId: this.template || undefined,
      dynamicTemplateData: this.templateData || undefined,
    };
  }
}
