import { Fragment } from 'react'
import type { Page, Post } from '@/payload-types'
import { ContentBlockUI } from '@/blocks/content'
import { CallToActionBlockUI } from '@/blocks/call-to-action'
import { CardBlockUI } from '@/blocks/card'
import { TabBlockUI } from '@/blocks/tab'
import { AccordionBlockUI } from '@/blocks/accordion'
import { DividerBlockUI } from '@/blocks/divider'
import { TableBlockUI } from '@/blocks/table'
import { LastModifiedBlockUI } from '@/blocks/last-modified'
import { RecentPostsBlockUI } from '@/blocks/recent-posts'
import { FormBlockUI } from '@/blocks/form'
import { PageContext } from '@/types/page-context'
import { TestimonialBlockUI } from '@/blocks/testimonial'
import { GalleryBlockUI } from '@/blocks/gallery'
import { HeadingBlockUI } from '@/blocks/heading'
import { ContactCardBlockUI } from '@/blocks/contact-card'
import { FaqBlockUI } from '@/blocks/faq'
import { ImageCarouselBlockUI } from '@/blocks/image-carousel'
import { MapBlockUI } from '@/blocks/map'

const blockComponents = {
  contentBlock: ContentBlockUI,
  callToActionBlock: CallToActionBlockUI,
  cardBlock: CardBlockUI,
  tabBlock: TabBlockUI,
  accordionBlock: AccordionBlockUI,
  dividerBlock: DividerBlockUI,
  formBlock: FormBlockUI,
  tableBlock: TableBlockUI,
  lastModifiedBlock: LastModifiedBlockUI,
  recentPostsBlock: RecentPostsBlockUI,
  imageCarouselBlock: ImageCarouselBlockUI,
  testimonialBlock: TestimonialBlockUI,
  galleryBlock: GalleryBlockUI,
  headingBlock: HeadingBlockUI,
  contactCardBlock: ContactCardBlockUI,
  faqBlock: FaqBlockUI,
  mapBlock: MapBlockUI,
}

type BlockRendererProps = {
  block:
    | NonNullable<NonNullable<NonNullable<Page['layout']>[0]['grid']>[0]['blocks']>[0]
    | NonNullable<NonNullable<NonNullable<Post['layout']>[0]['grid']>[0]['blocks']>[0]
  pageContext: PageContext
}

export function BlockRenderer({ block, pageContext }: Readonly<BlockRendererProps>) {
  const blockType = block.blockType as keyof typeof blockComponents
  const Block = blockComponents[blockType]

  return (
    <Fragment>
      {/* @ts-expect-error there may be some mismatch between the expected types here */}
      <Block {...block} pageContext={pageContext} />
    </Fragment>
  )
}
