/**
 * @see https://developers.mailersend.com/api/v1/email.html#send-an-email
 */
export interface HTMLEmail {
  from?: Identity;
  to: Identity[];
  cc?: Identity[];
  bcc?: Identity[];
  reply_to?: Identity;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
  template_id?: string;
  tags?: string[];
}

export interface Identity {
  email: string;
  name?: string;
}

export interface Attachment {
  id?: string;
  filename: string;
  content: string;
}
