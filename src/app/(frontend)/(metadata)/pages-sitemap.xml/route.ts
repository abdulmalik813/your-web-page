import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/lib/get-url'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting } from '@/payload-types'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()
    const setting = (await getCachedGlobal('settings', 1, false)) as Setting
    const isPostEnabled = setting.enablePost

    const dateFallback = new Date().toISOString()
    const sitemap: ISitemapField[] = []

    try {
      const pages = await payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      })

      if (pages.docs && pages.docs.length > 0) {
        pages.docs
          .filter((page) => Boolean(page?.slug))
          .forEach((page) => {
            sitemap.push({
              loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page.slug}`,
              lastmod: page.updatedAt || dateFallback,
            })
          })
      }

      if (isPostEnabled) {
        const postSlug = setting.postSlug || 'posts'

        try {
          const recentPost = await payload.find({
            collection: 'posts',
            overrideAccess: false,
            draft: false,
            depth: 0,
            limit: 1,
            pagination: false,
            sort: '-updatedAt',
            where: {
              _status: {
                equals: 'published',
              },
            },
            select: {
              updatedAt: true,
            },
          })

          const postListingLastmod = recentPost.docs?.[0]?.updatedAt || dateFallback

          sitemap.push({
            loc: `${SITE_URL}/${postSlug}`,
            lastmod: postListingLastmod,
          })
        } catch (error) {
          console.error('Error fetching post listing for sitemap:', error)
        }
      }
    } catch (error) {
      console.error('Error fetching pages for sitemap:', error)
    }

    return sitemap
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap', 'global-settings'],
  },
)

export async function GET() {
  try {
    const sitemap = await getPagesSitemap()
    return getServerSideSitemap(sitemap, {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    })
  } catch (error) {
    console.error('Error in sitemap GET handler:', error)

    const SITE_URL = getServerSideURL()
    return getServerSideSitemap([
      {
        loc: `${SITE_URL}/`,
        lastmod: new Date().toISOString(),
      },
    ])
  }
}
