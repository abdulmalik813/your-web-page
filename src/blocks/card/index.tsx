import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { CardBlock } from '@/payload-types'
import { joinStyles } from '@/lib/make-styles'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { NavigationBlockUI } from '@/blocks/navigation'
import { PageContext } from '@/types/page-context'

export async function CardBlockUI({
  pageContext,
  ...cardBlock
}: Partial<CardBlock> & { pageContext: PageContext }) {
  const showActionInHeader = cardBlock.actionPlacement === 'header'
  const showActionInFooter = cardBlock.actionPlacement === 'footer'

  return (
    <Card className={joinStyles(cardBlock.cardStyles)}>
      {(cardBlock.enableTitle ||
        cardBlock.enableDescription ||
        (cardBlock.enableAction && showActionInHeader)) && (
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {cardBlock.enableTitle && cardBlock.title && (
                <CardTitle className={joinStyles(cardBlock.titleStyles)}>
                  <h1>{cardBlock.title}</h1>
                </CardTitle>
              )}
              {cardBlock.enableDescription && cardBlock.description && (
                <CardDescription className={joinStyles(cardBlock.descriptionStyles)}>
                  {cardBlock.description}
                </CardDescription>
              )}
            </div>
            {cardBlock.enableAction && showActionInHeader && cardBlock.action && (
              <div className={joinStyles(cardBlock.actionStyles)}>
                {cardBlock.action.map((action, index) => (
                  <NavigationBlockUI key={index} {...action} pageContext={pageContext} />
                ))}
              </div>
            )}
          </div>
        </CardHeader>
      )}

      {cardBlock.enableContent && cardBlock.content && (
        <CardContent className={joinStyles(cardBlock.cardContentStyles)}>
          <LexicalRenderer content={cardBlock.content} pageContext={pageContext} />
        </CardContent>
      )}

      {(cardBlock.enableFooter || (cardBlock.enableAction && showActionInFooter)) && (
        <CardFooter className={joinStyles(cardBlock.footerStyles)}>
          <div className="flex items-center justify-between w-full gap-4">
            {cardBlock.enableFooter && cardBlock.footer && (
              <div className="flex-1">{cardBlock.footer}</div>
            )}
            {cardBlock.enableAction && showActionInFooter && cardBlock.action && (
              <div className={joinStyles(cardBlock.actionStyles)}>
                {cardBlock.action.map((action, index) => (
                  <NavigationBlockUI key={index} {...action} pageContext={pageContext} />
                ))}
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
