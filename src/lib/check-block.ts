import { Post, Page } from "@/payload-types"

export const checkBlock = (page: Post | Page, blockName: string): boolean => {
  const findBlockType = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object') return false

    if (obj.blockType === blockName) {
      return true
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        
        if (Array.isArray(value)) {
          if (value.some(item => findBlockType(item))) {
            return true
          }
        } else if (typeof value === 'object' && value !== null) {
          if (findBlockType(value)) {
            return true
          }
        }
      }
    }

    return false
  }
  return findBlockType(page.layout)
}