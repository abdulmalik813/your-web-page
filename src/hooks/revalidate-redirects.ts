import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc }) => {
  // Only invalidate the redirects cache — no need for full-site revalidation.
  // The redirect lookup is cached under the 'redirects' tag exclusively.
  revalidateTag('redirects', 'max')
  return doc
}

export const revalidateDeletedRedirects: CollectionAfterDeleteHook = async ({ doc }) => {
  revalidateTag('redirects', 'max')
  return doc
}
