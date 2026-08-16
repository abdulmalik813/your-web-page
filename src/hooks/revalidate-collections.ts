import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook } from 'payload'

export const revalidateCollection: CollectionAfterChangeHook = async ({ doc, collection }) => {
  revalidateTag(`collection-${collection.slug}`, 'max')
  return doc
}
