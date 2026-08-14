import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { ContentBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function ContentBlockUI({
  pageContext,
  ...contentBlock
}: ContentBlock & { pageContext: PageContext }) {
  return (
    <LexicalRenderer
      content={contentBlock.content}
      className={joinStyles(contentBlock.contentStyles)}
      pageContext={pageContext}
    />
  )
}
