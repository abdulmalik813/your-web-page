import { Setting } from '@/payload-types'
import { revalidateTag, revalidatePath } from 'next/cache'
import { getCachedGlobal } from '@/lib/get-globals'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function revalidateAll() {
  const payload = await getPayload({ config })

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
  })
  revalidatePath('/')
  pages.docs.forEach((page) => revalidatePath('/' + page.slug))

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
  })

  const postSlug = ((await getCachedGlobal('settings')) as Setting).postSlug
  revalidatePath(`/${postSlug}`)
  posts.docs.forEach((post) => revalidatePath(`/${postSlug}/${post.slug}`))
  payload.logger.info('Site Revalidation Complete')
}

export function revalidateGlobal(slug: string) {
  revalidateTag(`global-${slug}`, 'max')
}
