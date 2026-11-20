import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { resendAdapter } from '@payloadcms/email-resend';
import { requireEnv } from '@/lib/env';

export async function createEmailAdapter() {
  if (process.env.RESEND_API_KEY) {
    return resendAdapter({
      apiKey: requireEnv('RESEND_API_KEY'),
      defaultFromAddress: requireEnv('EMAIL_FROM'),
      defaultFromName: requireEnv('EMAIL_FROM_NAME'),
    });
  }

  return nodemailerAdapter({
    defaultFromAddress: requireEnv('EMAIL_FROM'),
    defaultFromName: requireEnv('EMAIL_FROM_NAME'),
    transportOptions: process.env.SMTP_HOST
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              : undefined,
        }
      : undefined,
    skipVerify: true,
  });
}
