import type { Payload } from 'payload';
import { COMPANY } from '@/data/company';

const contactFieldRow = (label: string, value: string) =>
  `<tr><td style="padding:10px 14px;border-top:1px solid #e5e5e5;background:#fafafa;width:140px;font-family:'Courier New',monospace;font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#525252;vertical-align:top;">${label}</td><td style="padding:10px 14px;border-top:1px solid #e5e5e5;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111111;">${value}</td></tr>`;

const contactAdminHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>New website enquiry</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f4;"><tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #000000;">
    <tr><td style="padding:20px 30px;border-bottom:1px solid #000000;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">${COMPANY.brand}</td></tr>
    <tr><td style="padding:30px;background:#fff7ed;border-bottom:1px solid #000000;">
      <p style="margin:0 0 10px;color:#9a3412;font-family:'Courier New',monospace;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">New website enquiry</p>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:normal;line-height:1.15;letter-spacing:-0.02em;color:#000000;">{{name}}</h1>
      <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#525252;">Submitted {{now}}</p>
    </td></tr>
    <tr><td style="padding:26px 30px 30px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e5e5;border-collapse:collapse;">
        ${contactFieldRow('Name', '{{name}}')}
        ${contactFieldRow('Email', '<a href="mailto:{{email}}" style="color:#9a3412;">{{email}}</a>')}
        {{#if phone}}${contactFieldRow('Phone', '{{phone}}')}{{/if}}
        ${contactFieldRow('Project type', '{{type}}')}
      </table>
      <h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:normal;color:#000000;">Message</h2>
      <div style="border-left:4px solid #f97316;padding:4px 0 4px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#262626;white-space:pre-wrap;">{{message}}</div>
      <p style="margin:26px 0 0;"><a href="mailto:{{email}}" style="display:inline-block;background:#f97316;color:#000000;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:13px 20px;">Reply to {{name}}</a></p>
    </td></tr>
    <tr><td style="padding:20px 30px;border-top:1px solid #000000;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#525252;">Sent from the contact form at <a href="${COMPANY.url}" style="color:#262626;">${COMPANY.domain}</a>.</td></tr>
  </table>
</td></tr></table>
</body></html>`;

const contactCustomerHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Thanks for getting in touch</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f4;"><tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #000000;">
    <tr><td style="padding:20px 30px;border-bottom:1px solid #000000;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">${COMPANY.brand}</td></tr>
    <tr><td style="padding:30px;background:#fff7ed;border-bottom:1px solid #000000;">
      <p style="margin:0 0 10px;color:#9a3412;font-family:'Courier New',monospace;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">Message received</p>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:normal;line-height:1.15;letter-spacing:-0.02em;color:#000000;">Thanks for getting in touch, {{name}}</h1>
    </td></tr>
    <tr><td style="padding:26px 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#262626;">
      <p style="margin:0 0 16px;">We have your message and will reply within one business day. If anything changes in the meantime, just reply to this email and it will reach us directly.</p>
      <h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:normal;color:#000000;">What you sent us</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e5e5;border-collapse:collapse;">
        ${contactFieldRow('Project type', '{{type}}')}
        {{#if phone}}${contactFieldRow('Phone', '{{phone}}')}{{/if}}
      </table>
      <div style="margin-top:18px;border-left:4px solid #f97316;padding:4px 0 4px 16px;white-space:pre-wrap;">{{message}}</div>
      <p style="margin:26px 0 0;">You can also call us on ${COMPANY.phone} or email <a href="mailto:${COMPANY.email}" style="color:#9a3412;">${COMPANY.email}</a>.</p>
      <p style="margin:22px 0 0;">— ${COMPANY.brand}, ${COMPANY.location.summary}</p>
    </td></tr>
    <tr><td style="padding:20px 30px;border-top:1px solid #000000;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#525252;">This is an automated confirmation of your message. Replies go to <a href="mailto:${COMPANY.email}" style="color:#262626;">${COMPANY.email}</a>.</td></tr>
  </table>
</td></tr></table>
</body></html>`;

const inboxMailbox = `"${COMPANY.brand}" <${process.env.EMAIL_TO || COMPANY.email}>`;

const FORM_DEFINITIONS = [
  {
    title: 'Contact',
    buttonLabel: 'Send message',
    fields: [
      { name: 'name', label: 'Your name', blockType: 'text', required: true, width: 50 },
      { name: 'email', label: 'Email', blockType: 'email', required: true, width: 50 },
      { name: 'phone', label: 'Phone (optional)', blockType: 'text', required: false, width: 50 },
      { name: 'type', label: 'Project type', blockType: 'select', required: true, width: 50, options: [{ label: 'Website', value: 'Website' }, { label: 'E-commerce', value: 'E-commerce' }, { label: 'SaaS or software', value: 'SaaS or software' }, { label: 'Care & Support', value: 'Care & Support' }, { label: 'Not sure yet', value: 'Not sure yet' }] },
      { name: 'message', label: 'Message', blockType: 'textarea', required: true, width: 100 },
    ],
  },
];

export const FORM_COUNT = FORM_DEFINITIONS.length;

export async function seedForms(
  payload: Payload,
): Promise<{ contactFormId: string | number | null; count: number }> {
  let contactFormId: string | number | null = null;
  let count = 0;

  for (const form of FORM_DEFINITIONS) {
    const data: any = {
      title: form.title,
      submitButtonLabel: form.buttonLabel,
      confirmationType: 'message',
      confirmationMessage: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [{
            type: 'paragraph',
            version: 1,
            children: [{
              type: 'text',
              text: 'Thanks. We will reply within one business day.',
              version: 1,
            }],
          }],
        },
      },
      fields: form.fields,
      emails: [
        {
          emailTo: inboxMailbox,
          replyTo: '"{{name}}" <{{email}}>',
          emailFrom: '',
          subject: `New website enquiry — {{name}}`,
          messageType: 'html',
          htmlMessage: contactAdminHtml,
        },
        {
          emailTo: '"{{name}}" <{{email}}>',
          replyTo: inboxMailbox,
          emailFrom: '',
          subject: `Thanks for getting in touch — ${COMPANY.brand}`,
          messageType: 'html',
          htmlMessage: contactCustomerHtml,
        },
      ],
    };
    const created = await payload.create({ collection: 'forms', data, overrideAccess: true });
    count += 1;
    if (form.title === 'Contact') contactFormId = created.id;
  }

  return { contactFormId, count };
}
