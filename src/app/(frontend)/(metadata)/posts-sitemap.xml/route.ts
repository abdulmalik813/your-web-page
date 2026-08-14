import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/lib/get-url'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting } from '@/payload-types'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()
    const setting = (await getCachedGlobal('settings', 1, false)) as Setting
    const isPostEnabled = setting.enablePost

    const dateFallback = new Date().toISOString()
    const sitemap: ISitemapField[] = []

    if (!isPostEnabled) {
      return sitemap
    }

    const postSlug = setting.postSlug || 'posts'

    try {
      const posts = await payload.find({
        collection: 'posts',
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

      if (posts.docs && posts.docs.length > 0) {
        posts.docs
          .filter((post) => Boolean(post?.slug))
          .forEach((post) => {
            sitemap.push({
              loc: `${SITE_URL}/${postSlug}/${post.slug}`,
              lastmod: post.updatedAt || dateFallback,
            })
          })
      }
    } catch (error) {
      console.error('Error fetching posts for sitemap:', error)
    }

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap', 'global-settings'],
  },
)

export async function GET() {
  try {
    const sitemap = await getPostsSitemap()
    return getServerSideSitemap(sitemap, {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    })
  } catch (error) {
    console.error('Error in posts sitemap GET handler:', error)

    return getServerSideSitemap([])
  }
}
