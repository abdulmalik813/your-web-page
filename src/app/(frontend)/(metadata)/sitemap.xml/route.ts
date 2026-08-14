import { getServerSideSitemapIndex } from 'next-sitemap'
import { getServerSideURL } from '@/lib/get-url'

export async function GET() {
  const SITE_URL = getServerSideURL()
  const sitemaps = [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`]

  return getServerSideSitemapIndex(sitemaps, {
    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
  })
}
