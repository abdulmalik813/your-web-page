import { TestimonialBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { TestimonialBlockClient } from '@/blocks/testimonial/client'

export async function TestimonialBlockUI({
  pageContext,
  ...testimonialBlock
}: Partial<TestimonialBlock> & { pageContext: PageContext }) {
  return (
    <TestimonialBlockClient {...testimonialBlock} pageContext={pageContext} />
  )
}
