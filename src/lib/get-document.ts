import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, slug: string, depth = 0, draft = false) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

async function getAllDocuments(collection: Collection, draft = false, limit = 10000) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection,
    draft,
    limit: limit
  })

  return result.docs
}

/**
 * Returns the document directly (cached when not in draft mode).
 * API is consistent with getCachedGlobal — always returns a Promise of the value.
 */
export const getCachedDocument = (
  collection: Collection,
  slug: string,
  depth = 0,
  draft = false
) => {
  if (draft) {
    return getDocument(collection, slug, depth, draft)
  }

  return unstable_cache(
    async () => getDocument(collection, slug, depth, draft),
    [collection, slug, depth.toString()],
    {
      tags: [`collection-${collection}`],
    }
  )()
}

/**
 * Returns all documents directly (cached when not in draft mode).
 * API is consistent with getCachedGlobal — always returns a Promise of the value.
 */
export const getCachedDocuments = (
  collection: Collection,
  draft = false,
  limit = 10000
) => {
  if (draft) {
    return getAllDocuments(collection, draft, limit)
  }

  return unstable_cache(
    async () => getAllDocuments(collection, draft, limit),
    [`collection-${collection}`],
    {
      tags: [`collection-${collection}`],
    }
  )()
}