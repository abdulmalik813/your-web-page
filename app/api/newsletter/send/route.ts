import config from '@payload-config';
import { getPayload } from 'payload';
import { getServerSideURL } from '@/lib/get-url';
import { NewsletterMailer } from '@/lib/newsletter/NewsletterMailer';

export async function POST(request: Request) {
  const base = getServerSideURL();
  if (!base || request.headers.get('origin') !== base) {
    return Response.json(
      { message: 'Invalid request origin or site URL configuration.' },
      { status: 403 },
    );
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return Response.json({ message: 'Authentication required.' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
    return Response.json(
      { message: 'Configure RESEND_API_KEY or SMTP_HOST before sending newsletters.' },
      { status: 503 },
    );
  }

  let id: unknown;
  try {
    id = (await request.json()).id;
  } catch {
    return Response.json({ message: 'Invalid newsletter.' }, { status: 400 });
  }

  if (typeof id !== 'string' && typeof id !== 'number') {
    return Response.json({ message: 'Invalid newsletter.' }, { status: 400 });
  }

  try {
    const newsletter = await payload.findByID({
      collection: 'newsletter',
      id,
      draft: false,
      overrideAccess: false,
      depth: 2,
    });

    if (!newsletter || newsletter._status !== 'published') {
      return Response.json(
        { message: 'Publish the newsletter before sending.' },
        { status: 400 },
      );
    }

    const result = await new NewsletterMailer(payload, base).send(newsletter);
    const message = result.failed
      ? `Sent to ${result.sent} subscribers; ${result.failed} deliveries failed. Retrying sends to everyone again.`
      : `Sent to ${result.sent} subscribers.`;

    return Response.json({ message }, { status: result.failed ? 207 : 200 });
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Newsletter send failed.' });
    return Response.json(
      {
        message:
          'Unable to send the newsletter. Check delivery before retrying to avoid duplicates.',
      },
      { status: 500 },
    );
  }
}
