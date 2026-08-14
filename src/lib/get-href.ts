import { Setting } from '@/payload-types'

export function getHref(link: any, setting: Setting | null | undefined) {
  if (link.type === 'postListingPage') {
    const postSlug = setting?.postSlug || 'posts'
    return `/${postSlug}`
  }
  
  if (link?.type === 'custom') {
    return link.url
  }
  
  if (link?.reference?.relationTo === 'pages') {
    if (typeof link.reference.value === 'object') {
      return link.reference.value.slug === 'home' 
        ? '/' 
        : `/${link.reference.value.slug}`
    }
    return null
  }
  
  if (link?.reference?.relationTo === 'posts') {
    if (typeof link.reference.value === 'object') {
      const postSlug = setting?.postSlug || 'posts'
      return `/${postSlug}/${link.reference.value.slug}`
    }
    return null
  }
  
  return null
}