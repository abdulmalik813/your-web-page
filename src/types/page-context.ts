import { Page, Post, Setting } from '@/payload-types'
import { SearchParams } from '@/types/search-params'

export type PageContext = {
  searchParams?: SearchParams
  setting: Setting
  page?: Page | Post | null
  draft?: boolean | false
  slug?: string | null
  isItAPost?: boolean | null
  isPostListingPage?: boolean | null
}
