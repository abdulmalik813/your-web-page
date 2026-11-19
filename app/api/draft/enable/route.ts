import config from '@payload-config';
import { getPayload } from 'payload';
import { draftMode } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getPreviewSecret } from '@/lib/live-preview';

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get('path');

  if (searchParams.get('previewSecret') !== getPreviewSecret()) {
    return new Response('You are not allowed to preview this page.', { status: 403 });
  }

  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return new Response('A valid preview path is required.', { status: 400 });
  }

  const destination = new URL(path, request.nextUrl.origin);
  if (destination.origin !== request.nextUrl.origin) {
    return new Response('The preview path must be on this site.', { status: 400 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response('You are not allowed to preview this page.', { status: 403 });
  }

  (await draftMode()).enable();
  return NextResponse.redirect(destination);
}
