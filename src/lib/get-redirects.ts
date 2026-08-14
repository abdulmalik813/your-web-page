import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/lib/get-url'

export async function getRedirects(depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    limit: 0,
    pagination: false,
  })

  return redirects
}

/**
 * Returns a normalized redirect map for O(1) lookups.
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
  unstable_cache(
    async () => {
      const redirects = await getRedirects()
      const serverUrl = getServerSideURL()

      const redirectMap: Record<string, any> = {}

      for (const redirect of redirects) {
        let fromPath = redirect.from.startsWith(serverUrl)
          ? redirect.from.slice(serverUrl.length)
          : redirect.from
        if (fromPath.startsWith('/')) fromPath = fromPath.slice(1)

        if (fromPath === '') fromPath = 'home'

        redirectMap[fromPath] = redirect.to
      }

      return redirectMap
    },
    ['redirects'],
    {
      tags: ['redirects'],
    },
  )
