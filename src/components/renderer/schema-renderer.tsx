import { blogSchema, postListingSchema, pageSchema } from '@/lib/seo-schema'
import { Post, Page } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function SchemaRenderer({ pageContext }: { pageContext: PageContext }) {
  const { page, isItAPost, isPostListingPage, setting } = pageContext
  let schema = null

  if (isPostListingPage) {
    schema = await postListingSchema(setting)
  } else if (isItAPost && page) {
    schema = await blogSchema(page as Post, setting)
  } else if (page) {
    schema = await pageSchema(page as Page, setting)
  }

  if (!schema) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
