import { LastModifiedBlock } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { joinStyles } from '@/lib/make-styles'
import { TIMEZONES } from '@/constants/init'
import { PageContext } from '@/types/page-context'

export function LastModifiedBlockUI({
  pageContext,
  ...lastModifiedBlock
}: Partial<LastModifiedBlock> & { pageContext: PageContext }) {
  if (!pageContext.page) {
    return <></>
  }

  const { updatedAt } = pageContext.page
  const timeZone = TIMEZONES.DEFAULT_TIMEZONE

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timeZone,
  }).format(new Date(updatedAt))

  return (
    <Card className={joinStyles(lastModifiedBlock.cardStyles)}>
      <CardContent className={joinStyles(lastModifiedBlock.cardContentStyles)}>
        Last modified on {formattedDate}
        {pageContext.page.author &&
          typeof pageContext.page.author === 'object' &&
          pageContext.page.author?.name && <> by {pageContext.page.author.name}</>}
      </CardContent>
    </Card>
  )
}
