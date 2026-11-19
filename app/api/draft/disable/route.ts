import { draftMode } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  const path = request.nextUrl.searchParams.get('path') || '/';
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('A valid redirect path is required.', { status: 400 });
  }

  const destination = new URL(path, request.nextUrl.origin);
  if (destination.origin !== request.nextUrl.origin) {
    return new Response('The redirect path must be on this site.', { status: 400 });
  }

  (await draftMode()).disable();
  return NextResponse.redirect(destination);
}
