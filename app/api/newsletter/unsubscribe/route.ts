import config from '@payload-config';
import { getPayload } from 'payload';

export async function POST(request: Request) {
  let token = '';
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      token = typeof body?.token === 'string' ? body.token : '';
    } else {
      token = new URL(request.url).searchParams.get('token') || '';
    }
  } catch { return Response.json({ message: 'Invalid unsubscribe link.' }, { status: 400 }); }
  if (!/^[a-f0-9]{64}$/.test(token)) return Response.json({ message: 'Invalid unsubscribe link.' }, { status: 400 });

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: 'subscribers', where: { unsubscribeToken: { equals: token } }, limit: 1, overrideAccess: true });
    if (!result.docs[0]) return Response.json({ message: 'This unsubscribe link is invalid or no longer active.' }, { status: 404 });
    if (result.docs[0].status !== 'unsubscribed') {
      await payload.update({ collection: 'subscribers', id: result.docs[0].id, data: { status: 'unsubscribed' }, overrideAccess: true });
    }
    return Response.json({ message: 'You have been unsubscribed.' });
  } catch (error) {
    console.error('Newsletter unsubscribe failed:', error);
    return Response.json({ message: 'Unable to unsubscribe right now. Please try again.' }, { status: 500 });
  }
}
