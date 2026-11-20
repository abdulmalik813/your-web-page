import config from '@payload-config';
import { getPayload } from 'payload';
import { type NextRequest, NextResponse } from 'next/server';
import { getPreviewSecret } from '@/lib/live-preview';

export const dynamic = 'force-dynamic';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
  Vary: 'Cookie',
};

/**
 * Client-side gate for the public admin toolbar. Public pages are static, so
 * the toolbar cannot be rendered from the server; this endpoint tells the
 * browser whether the visitor has a Payload session and returns the signed
 * preview URL only to that session.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });

  if (!user) {
    return NextResponse.json({ signedIn: false }, { status: 401, headers: noStoreHeaders });
  }

  const rawPath = request.nextUrl.searchParams.get('path') || '/';
  const path =
    rawPath.startsWith('/') && !rawPath.startsWith('//')
      ? rawPath.split('?')[0].split('#')[0]
      : '/';
  const previewPath = path === '/' ? '/preview' : `/preview${path}`;

  const previewHref = `/api/draft/enable?${new URLSearchParams({
    path: previewPath,
    previewSecret: getPreviewSecret(),
  }).toString()}`;

  return NextResponse.json({ signedIn: true, previewHref }, { headers: noStoreHeaders });
}
