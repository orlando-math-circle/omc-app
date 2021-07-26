/**
 * MailerSend - Send an Email
 *
 * @see https://developers.mailersend.com/api/v1/email.html#send-an-email
 */

export type PersonalizationData = Record<string, any>;

export interface Personalization {
  email: string;
  data: PersonalizationData;
}

// Custom type for implementation only.
export type DataIdentity = Identity & { data?: PersonalizationData };

export interface Identity {
  email: string;
  name?: string;
}

export interface Attachment {
  content: string;
  filename: string;
  id?: string;
}

export type Request = BaseRequest & (HTMLRequest | TemplateRequest);

export interface BaseRequest {
  to: Identity[];
  cc?: Identity[];
  bcc?: Identity[];
  reply_to?: Identity;
  attachments?: Attachment[];
  tags?: string[];
  personalization?: Personalization[];
}

export interface HTMLRequest {
  from: Identity;
  subject: string;
  html: string;
  text: string;
}

export interface TemplateRequest {
  from?: Identity;
  subject?: string;
  template_id: string;
}
