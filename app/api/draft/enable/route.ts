
import config from '@payload-config';
import { getPayload } from 'payload';
import { draftMode } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getPreviewSecret } from '@/lib/live-preview';
import { getServerSideURL } from '@/lib/get-url';

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get('path');

  // Validate preview secret
  if (searchParams.get('previewSecret') !== getPreviewSecret()) {
    return new Response('You are not allowed to preview this page.', {
      status: 403,
    });
  }

  // Validate preview path
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return new Response('A valid preview path is required.', {
      status: 400,
    });
  }

  // Build destination using the configured server URL
  const serverURL = getServerSideURL();
  const destination = new URL(path, serverURL);

  const payload = await getPayload({ config });
  const { user } = await payload.auth({
    headers: request.headers,
  });

  if (!user) {
    return new Response('You are not allowed to preview this page.', {
      status: 403,
    });
  }

  (await draftMode()).enable();
  return NextResponse.redirect(destination);
}
