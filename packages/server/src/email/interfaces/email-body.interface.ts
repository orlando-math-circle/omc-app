export type EmailBody = HTMLBody | TemplateBody;

export interface HTMLBody {
  html: string;
}

export interface TemplateBody {
  templateId: string;
  templateData: Record<string, any>;
}
