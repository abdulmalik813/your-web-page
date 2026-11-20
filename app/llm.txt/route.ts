import { buildLlmsTxt } from '@/lib/llms';

/** Alias for /llms.txt, matching the shorter filename some tools request. */
export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
