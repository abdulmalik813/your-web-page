import config from '@payload-config';
import { getPayload } from 'payload';
import { randomBytes } from 'node:crypto';
import { isValidEmail } from '@/lib/validation';

export async function POST(request: Request) {
  let body: { email?: unknown };
  try { body = await request.json(); } catch { return Response.json({ message: 'Please enter a valid email address.' }, { status: 400 }); }
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !isValidEmail(email)) return Response.json({ message: 'Please enter a valid email address.' }, { status: 400 });

  try {
    const payload = await getPayload({ config });
    const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    if (existing.docs[0]) {
      if (existing.docs[0].status !== 'subscribed') {
        await payload.update({ collection: 'subscribers', id: existing.docs[0].id, data: { status: 'subscribed', unsubscribeToken: randomBytes(32).toString('hex') }, overrideAccess: true });
      }
    } else {
      await payload.create({ collection: 'subscribers', data: { email, status: 'subscribed', unsubscribeToken: randomBytes(32).toString('hex') }, overrideAccess: true });
    }
    return Response.json({ message: 'Thanks for subscribing!' });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return Response.json({ message: 'Unable to subscribe right now. Please try again.' }, { status: 500 });
  }
}
