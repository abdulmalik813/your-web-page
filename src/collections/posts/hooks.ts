import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
} from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post, Setting } from '@/payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const setting = (await payload.findGlobal({ slug: 'settings' })) as Setting
    const postSlug = setting.postSlug || 'posts'

    if (doc._status === 'published') {
      const path = `/${postSlug}/${doc.slug}`
      revalidatePath(path)
      revalidatePath(`/${postSlug}`)
      revalidateTag('posts-sitemap', undefined as any)
      revalidateTag(`posts-slug-${doc.slug}`, undefined as any)
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${postSlug}/${previousDoc.slug}`
      revalidatePath(oldPath)
      revalidatePath(`/${postSlug}`)
      revalidateTag('posts-sitemap', undefined as any)
      revalidateTag(`posts-slug-${previousDoc.slug}`, undefined as any)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const setting = (await payload.findGlobal({ slug: 'settings' })) as Setting
    const postSlug = setting.postSlug || 'posts'

    const path = `/${postSlug}/${doc?.slug}`
    revalidatePath(path)
    revalidatePath(`/${postSlug}`)
    revalidateTag('posts-sitemap', undefined as any)
    revalidateTag(`posts-slug-${doc?.slug}`, undefined as any)
  }

  return doc
}

export const populatePublishedAt: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (req.data && !req.data.publishedAt) {
      const now = new Date()
      return {
        ...data,
        publishedAt: now,
      }
    }
  }

  return data
}
