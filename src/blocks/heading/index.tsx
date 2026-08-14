import { joinStyles } from '@/lib/make-styles'
import { HeadingBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export function HeadingBlockUI({
  pageContext,
  ...headingBlock
}: HeadingBlock & { pageContext: PageContext }) {
  if (!headingBlock?.headingText) return null
  const { headingTag: Tag, headingText, headingStyles } = headingBlock

  return <Tag className={joinStyles(headingStyles)}>{headingText}</Tag>
}
