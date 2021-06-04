import { BadRequestException } from '@nestjs/common';
import * as MailerSend from '../email/interfaces/mailersend.interface';

export class Email {
  private to: MailerSend.Identity[] = [];
  private cc?: MailerSend.Identity[];
  private bcc?: MailerSend.Identity[];
  private reply_to?: MailerSend.Identity;
  private from?: MailerSend.Identity;
  private attachments?: MailerSend.Attachment[];
  private tags?: string[];
  private html?: string;
  private text?: string;
  private subject?: string;
  private template?: string;
  private personalization?: MailerSend.Personalization[];

  /**
   * Sets a single recipient for the email.
   *
   * @param email Email address of the recipient.
   * @param [name] Name of the recipient.
   * @param [data] Personalization data.
   */
  public setTo(
    email: string,
    name?: string,
    data?: MailerSend.PersonalizationData,
  ): this;

  /**
   * Sets the recipients for an email.
   *
   * Must include at least 1 recipient and at most 50.
   *
   * @param identities Email recipients.
   */
  public setTo(identities: MailerSend.DataIdentity[]): this;

  public setTo(
    emailOrIdentities: string | MailerSend.DataIdentity[],
    name?: string,
    data?: MailerSend.PersonalizationData,
  ) {
    if (Array.isArray(emailOrIdentities)) {
      return this.setIdentities(emailOrIdentities);
    }

    this.to = [{ email: emailOrIdentities, name }];
    this.personalization = data && [{ email: emailOrIdentities, data }];

    return this;
  }

  /**
   * Maps the customized `DataIdentity` format into the split
   * `to` and `personalization` arrays desired by MailerSend.
   *
   * @param identities Email recipient identities.
   */
  private setIdentities(
    identities: MailerSend.DataIdentity[] | MailerSend.Identity[],
  ) {
    const to: MailerSend.Identity[] = [];
    const personalization: MailerSend.Personalization[] = [];

    for (const identity of identities) {
      to.push({ email: identity.email, name: identity.name });

      if ('data' in identity && identity.data) {
        personalization.push({ email: identity.email, data: identity.data });
      }
    }

    this.to = to;
    this.personalization = personalization;

    return this;
  }

  /**
   * Sets the email sender. Must be from the
   * approved MailerSend domain.
   *
   * @param email Sender email address.
   * @param [name] Sender name.
   */
  public setFrom(email: string, name?: string) {
    this.from = {
      email,
      name,
    };

    return this;
  }

  /**
   * Sets the carbon copy recipients of the email.
   *
   * @param identities Email identities.
   */
  public setCC(identities: MailerSend.Identity[]) {
    this.cc = identities;
  }

  /**
   * Sets the blind carbon copy recipients off the email.
   *
   * @param identities Email identities.
   */
  public setBCC(identities: MailerSend.Identity[]) {
    this.bcc = identities;
  }

  /**
   * Sets the name and email for the `reply-to` of the email.
   *
   * @param identity Email identity.
   */
  public setReplyTo(identity: MailerSend.Identity) {
    this.reply_to = identity;
  }

  /**
   * Sets attachments to the email.
   *
   * @param attachments Email attachments.
   */
  public setAttachments(attachments: MailerSend.Attachment[]) {
    this.attachments = attachments;
  }

  /**
   * Sets tags on the email.
   *
   * @param tags String array.
   */
  public setTags(tags: string[]) {
    this.tags = tags;
  }

  /**
   * Sets the email HTML.
   *
   * @param html HTML body of the email.
   * @param text Optionally set the text representation of the email.
   */
  public setHTML(html: string, text?: string) {
    this.html = html;

    if (text) {
      this.text = text;
    }

    return this;
  }

  /**
   * Sets the email text.
   *
   * @param text Text representation of the email.
   */
  public setText(text: string) {
    this.text = text;
  }

  /**
   * Sets the MailerSend email template.
   *
   * @param id Template id.
   */
  public setTemplate(id: string) {
    this.template = id;

    return this;
  }

  /**
   * Sets the subject of the email.
   *
   * @param subject Email subject.
   */
  public setSubject(subject: string) {
    this.subject = subject;

    return this;
  }

  /**
   * Builds a MailerSend request for the email.
   *
   * @returns MailerSend email request data.
   */
  public toRequest(): MailerSend.Request {
    const request: MailerSend.BaseRequest = {
      to: this.to,
      personalization: this.personalization,
    };

    // Templated Request
    if (this.template?.length) {
      return {
        ...request,
        cc: this.cc,
        bcc: this.bcc,
        reply_to: this.reply_to,
        attachments: this.attachments,
        tags: this.tags,
        from: this.from,
        subject: this.subject,
        template_id: this.template,
      };
    }

    if (!this.subject?.length) {
      throw new BadRequestException('Subject missing in HTML email');
    }

    if (!this.html?.length || !this.text?.length) {
      throw new BadRequestException('HTML or text missing in HTML email');
    }

    if (!this.from) {
      throw new BadRequestException('From not specified in HTML request');
    }

    return {
      ...request,
      from: this.from,
      subject: this.subject,
      html: this.html,
      text: this.text,
    };
  }
}
