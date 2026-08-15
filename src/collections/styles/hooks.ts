import {
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'
import type { Style } from '@/payload-types'
import FormData from 'form-data'
import axios from 'axios'
import { revalidateTag } from 'next/cache'
import { globalCSS } from '@/constants/global-css'
import { TAILWIND_GENERATOR } from '@/constants/init'
export const generateStylesheet: CollectionBeforeChangeHook<Style> = async ({ data }) => {
  if (data.tailwind !== false) {
    const endpoint = TAILWIND_GENERATOR + "/generate"
    const className = data.className
    const title = data.alias
    const formData = new FormData()
    formData.append('className', className)
    formData.append('file', globalCSS)
    formData.append('title', title)
    try {
      const response = await axios.post(endpoint, formData, {
        headers: formData.getHeaders(),
      })
      data.stylesheet = response.data
    } catch (error) {
      console.error('Error generating Tailwind CSS:', error)
    }
  }
  return data
}
export const revalidateCache: CollectionAfterChangeHook<Style> = async ({ doc }) => {
  revalidateTag('collection-styles', undefined as any)
  return doc
}
export const revalidateDelete: CollectionAfterDeleteHook<Style> = async () => {
  revalidateTag('collection-styles', undefined as any)
}
