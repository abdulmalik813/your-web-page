import type { FormattedEmail } from '@payloadcms/plugin-form-builder/types';
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';
import Handlebars from 'handlebars';
import type { Payload } from 'payload';

type SubmissionField = { field: string; value: unknown };

type FormEmailConfig = {
  bcc?: string | null;
  cc?: string | null;
  emailFrom?: string | null;
  emailTo?: string | null;
  htmlMessage?: string | null;
  message?: unknown;
  messageType?: 'html' | 'rich_text' | null;
  replyTo?: string | null;
  subject?: string | null;
};

type FormEmailHookArgs = {
  data?: {
    form?: string | { id?: string };
    submissionData?: SubmissionField[];
  };
  req?: { payload?: Payload };
};

Handlebars.registerHelper('now', () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Halifax',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date()),
);

function renderTemplate(template: string, fields: SubmissionField[]): string {
  if (!template) return '';

  const context = fields.reduce<Record<string, unknown>>((values, { field, value }) => {
    values[field] = value;
    return values;
  }, {});

  try {
    return Handlebars.compile(template)(context);
  } catch (error) {
    console.error('[form-email] template error:', error);
    return '';
  }
}

export class FormEmailService {
  async build(emailsToSend: FormattedEmail[], params: unknown): Promise<FormattedEmail[]> {
    const { data, req } = (params ?? {}) as FormEmailHookArgs;
    const formRef = data?.form;
    const formId = typeof formRef === 'string' ? formRef : formRef?.id;

    if (!req?.payload || !formId) return emailsToSend;

    let form: { emails?: FormEmailConfig[] | null };
    try {
      form = (await req.payload.findByID({
        collection: 'forms',
        id: formId,
        overrideAccess: true,
        depth: 0,
      })) as { emails?: FormEmailConfig[] | null };
    } catch {
      return emailsToSend;
    }

    const fields = data?.submissionData ?? [];
    const emails = (form.emails ?? []).map((config) => this.render(config, fields));

    return emails.length ? emails : emailsToSend;
  }

  private render(config: FormEmailConfig, fields: SubmissionField[]): FormattedEmail {
    return {
      to: renderTemplate(String(config.emailTo ?? ''), fields),
      subject: renderTemplate(String(config.subject ?? ''), fields),
      from: renderTemplate(String(config.emailFrom ?? ''), fields),
      cc: renderTemplate(String(config.cc ?? ''), fields),
      bcc: renderTemplate(String(config.bcc ?? ''), fields),
      replyTo: renderTemplate(String(config.replyTo ?? ''), fields),
      html: renderTemplate(this.messageContent(config), fields),
    };
  }

  private messageContent(config: FormEmailConfig): string {
    if (config.messageType === 'html') return String(config.htmlMessage ?? '');

    if (typeof config.message === 'string') return config.message;

    if (config.message && typeof config.message === 'object') {
      try {
        return convertLexicalToHTML({ data: config.message as never });
      } catch {
        return '';
      }
    }

    return '';
  }
}

export const formEmailService = new FormEmailService();
