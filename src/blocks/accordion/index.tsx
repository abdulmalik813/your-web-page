import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AccordionBlock } from '@/payload-types'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'

export async function AccordionBlockUI({
  pageContext,
  ...accordionBlock
}: AccordionBlock & { pageContext: PageContext }) {
  return (
    <Accordion type="single" collapsible className={joinStyles(accordionBlock.accordionStyles)}>
      {accordionBlock.items.map((item) => (
        <AccordionItem
          value={item.trigger}
          key={item.id}
          className={joinStyles(accordionBlock.accordionItemStyles)}
        >
          <AccordionTrigger className={joinStyles(item.triggerStyles)}>
            {item.trigger}
          </AccordionTrigger>
          <AccordionContent className={joinStyles(item.contentStyles)}>
            <LexicalRenderer content={item.content} pageContext={pageContext} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
