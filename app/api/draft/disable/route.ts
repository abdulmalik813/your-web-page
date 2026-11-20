import { draftMode } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getRequestOrigin } from '@/lib/request-origin';

export async function GET(request: NextRequest): Promise<Response> {
  const path = request.nextUrl.searchParams.get('path') || '/';
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('A valid redirect path is required.', { status: 400 });
  }

  const origin = getRequestOrigin(request);
  const destination = new URL(path, origin);
  if (destination.origin !== origin) {
    return new Response('The redirect path must be on this site.', { status: 400 });
  }

  (await draftMode()).disable();
  return NextResponse.redirect(destination);
}
