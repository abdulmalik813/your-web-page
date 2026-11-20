import type { NextRequest } from 'next/server';
import { getAllowedOrigins, getServerSideURL } from './get-url';

/**
 * Return the origin the browser actually used, but never an origin that is not
 * configured. This keeps draft/preview redirects on the same host as the admin
 * session instead of switching between localhost and 127.0.0.1.
 */
export function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost?.split(',')[0]?.trim() || request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const proto =
    forwardedProto?.split(',')[0]?.trim() ||
    request.nextUrl.protocol.replace(':', '') ||
    'http';

  if (host) {
    const origin = `${proto}://${host}`;
    if (getAllowedOrigins().includes(origin)) return origin;
  }

  return getServerSideURL() || request.nextUrl.origin;
}
