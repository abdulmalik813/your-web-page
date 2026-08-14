import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateAll } from '@/lib/revalidate'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateAll()
  return doc
}

export const revalidateDeletedRedirects: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateAll()
  return doc
}
