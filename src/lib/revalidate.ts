import { Setting } from '@/payload-types'
import { revalidateTag, revalidatePath } from 'next/cache'
import { getPayload, PayloadRequest } from 'payload'
import config from '@payload-config'

/**
 * Full-site revalidation. Accepts an optional `req` so that DB reads
 * happen inside the same transaction as the triggering hook, avoiding
 * stale-read issues on MongoDB replica sets.
 */
export async function revalidateAll(req?: PayloadRequest) {
  const payload = req?.payload ?? await getPayload({ config })

  const collections = payload.config.collections
  for (const collection of collections) {
    revalidateTag(`collection-${collection.slug}`, 'max')
  }

  const globals = payload.config.globals
  for (const global of globals) {
    revalidateTag(`global-${global.slug}`, 'max')
  }

  revalidateTag('redirects', 'max')
  revalidateTag('pages-sitemap', 'max')
  revalidateTag('posts-sitemap', 'max')
  revalidateTag('compiled-stylesheet', 'max')

  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    ...(req && { req }),
  })
  revalidatePath('/')
  pages.docs.forEach((page) => revalidatePath('/' + page.slug))

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
    ...(req && { req }),
  })

  // Use findGlobal directly instead of getCachedGlobal to avoid
  // circular cache dependency (we just invalidated the cache tag above).
  const setting = (await payload.findGlobal({
    slug: 'settings',
    ...(req && { req }),
  })) as Setting
  const postSlug = setting.postSlug
  revalidatePath(`/${postSlug}`)
  posts.docs.forEach((post) => revalidatePath(`/${postSlug}/${post.slug}`))
  payload.logger.info('Site Revalidation Complete')
}

export function revalidateGlobal(slug: string) {
  revalidateTag(`global-${slug}`, 'max')
}
