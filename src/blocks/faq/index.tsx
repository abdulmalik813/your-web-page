import type { Faq, FaqBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { joinStyles } from '@/lib/make-styles'

export async function FaqBlockUI({
  pageContext,
  ...faqBlock
}: FaqBlock & { pageContext: PageContext }) {
  if (!faqBlock || typeof faqBlock != 'object') {
    return null
  }

  return (
    <Accordion type="single" collapsible className={joinStyles(faqBlock.accordionStyles)}>
      {faqBlock?.faq?.map((faq) => {
        if (typeof faq !== 'object') return null
        return (
          <AccordionItem 
            value={`${faq.id}`} 
            key={faq.id}
            className={joinStyles(faqBlock.itemStyles)}
          >
            <AccordionTrigger className={joinStyles(faqBlock.questionStyles)}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className={joinStyles(faqBlock.answerStyles)}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}