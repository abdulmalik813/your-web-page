import { getServerSideURL } from '@/lib/get-url'

export async function GET() {
  const SITE_URL = getServerSideURL()

  const robots = `User-agent: *
Disallow: /admin/*

Sitemap: ${SITE_URL}/sitemap.xml`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
}
