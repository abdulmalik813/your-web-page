import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import type { Field } from 'payload';
import { formEmailService } from '@/lib/email/FormEmailService';

type MutableField = {
  admin?: Record<string, unknown>;
  fields?: MutableField[];
  name?: string;
  [key: string]: unknown;
};

const emailsDescription =
  "Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}. Handlebars expressions are supported.";

function extendEmailsField(field: MutableField): MutableField {
  if (field.name !== 'emails') return field;

  return {
    ...field,
    admin: { ...(field.admin ?? {}), description: emailsDescription },
    fields: (field.fields ?? []).flatMap((child) => {
      if (child.name !== 'message') return [child];

      return [
        {
          name: 'messageType',
          type: 'select',
          defaultValue: 'rich_text',
          required: true,
          options: [
            { label: 'Rich Text', value: 'rich_text' },
            { label: 'Custom HTML', value: 'html' },
          ],
        },
        {
          ...child,
          admin: {
            ...(child.admin ?? {}),
            condition: (_: unknown, siblingData: { messageType?: string }) =>
              siblingData?.messageType !== 'html',
          },
        },
        {
          name: 'htmlMessage',
          type: 'code',
          label: 'HTML Message',
          admin: {
            language: 'html',
            condition: (_: unknown, siblingData: { messageType?: string }) =>
              siblingData?.messageType === 'html',
          },
        },
      ];
    }),
  };
}

export function createFormBuilderPlugin() {
  return formBuilderPlugin({
    defaultToEmail: process.env.EMAIL_TO,
    redirectRelationships: ['pages'],
    fields: {
      payment: false,
      state: false,
      country: true,
      date: true,
      time: true,
      upload: false,
    },
    formSubmissionOverrides: {
      access: {
        read: ({ req }) => Boolean(req.user),
        create: () => true,
        update: ({ req }) => Boolean(req.user),
        delete: ({ req }) => Boolean(req.user),
      },
    },
    beforeEmail: (emails, params) => formEmailService.build(emails, params),
    formOverrides: {
      fields: ({ defaultFields }) =>
        (defaultFields as unknown as MutableField[]).map(extendEmailsField) as unknown as Field[],
    },
  });
}
