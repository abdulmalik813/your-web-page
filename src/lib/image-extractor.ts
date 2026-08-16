import { Post, Page, Media } from "@/payload-types"

export const mediaExtractor = (page: Post | Page): Media[] => {
  const mediaItems: Media[] = []
  const seenIds = new Set<number>()

  const addMedia = (item: any) => {
    if (!item) return
    
    if (
      typeof item === 'object' &&
      'id' in item &&
      typeof item.id === 'number' &&
      ('url' in item || 'filename' in item)
    ) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id)
        mediaItems.push(item as Media)
      }
      return
    }
  }

  const traverse = (obj: any) => {
    if (!obj || typeof obj !== 'object') return

    addMedia(obj)

    if (Array.isArray(obj)) {
      obj.forEach(item => traverse(item))
      return
    }

    if (obj.root && obj.root.children) {
      traverse(obj.root.children)
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        
        if (key === 'media' || key === 'image' || key === 'avatar' || key === 'logo' || key === 'logoDark') {
          addMedia(value)
        }
        
        if (key === 'type' && typeof value === 'string' && value.includes('Block')) {
          if (obj.fields) {
            traverse(obj.fields)
          }
        }
        
        if (key === 'fields' && typeof value === 'object') {
          traverse(value)
        }
        
        if (key === 'type' && value === 'upload') {
          if (obj.value) traverse(obj.value)
        }
        
        if (typeof value === 'object' && value !== null) {
          traverse(value)
        }
      }
    }
  }

  traverse(page)
  return mediaItems
}