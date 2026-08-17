import type { Block } from 'payload'
import { ContentBlock } from '@/blocks/content/config'
import { CallToActionBlock } from '@/blocks/call-to-action/config'
import { CardBlock } from '@/blocks/card/config'
import { TabBlock } from '@/blocks/tab/config'
import { AccordionBlock } from '@/blocks/accordion/config'
import { DividerBlock } from '@/blocks/divider/config'
import { FormBlock } from '@/blocks/form/config'
import { TableBlock } from '@/blocks/table/config'
import { LastModifiedBlock } from '@/blocks/last-modified/config'
import { TestimonialBlock } from '@/blocks/testimonial/config'
import { GalleryBlock } from '@/blocks/gallery/config'
import { HeadingBlock } from '@/blocks/heading/config'
import { ContactCardBlock } from '@/blocks/contact-card/config'
import { FaqBlock } from '@/blocks/faq/config'
import { RecentPostsBlock } from '@/blocks/recent-posts/config'
import { ImageCarouselBlock } from '@/blocks/image-carousel/config'
import { MapBlock } from '@/blocks/map/config'

export type BlockSlug =
  | 'content'
  | 'call-to-action'
  | 'card'
  | 'tab'
  | 'accordion'
  | 'divider'
  | 'form'
  | 'table'
  | 'last-modified'
  | 'testimonial'
  | 'gallery'
  | 'heading'
  | 'contact-card'
  | 'faq'
  | 'recent-posts'
  | 'image-carousel'
  | 'mapBlock'
interface GetBlocksOptions {
  dbPrefix?: string
  exclude?: BlockSlug[]
}

export function Blocks(options: GetBlocksOptions = {}): Block[] {
  const { dbPrefix = '', exclude = [] } = options

  const allBlocks: { slug: BlockSlug; block: (prefix?: string) => Block }[] = [
    { slug: 'content', block: ContentBlock },
    { slug: 'call-to-action', block: CallToActionBlock },
    { slug: 'card', block: CardBlock },
    { slug: 'tab', block: TabBlock },
    { slug: 'accordion', block: AccordionBlock },
    { slug: 'divider', block: DividerBlock },
    { slug: 'form', block: FormBlock },
    { slug: 'table', block: TableBlock },
    { slug: 'last-modified', block: LastModifiedBlock },
    { slug: 'image-carousel', block: ImageCarouselBlock },
    { slug: 'testimonial', block: TestimonialBlock },
    { slug: 'gallery', block: GalleryBlock },
    { slug: 'heading', block: HeadingBlock },
    { slug: 'contact-card', block: ContactCardBlock },
    { slug: 'faq', block: FaqBlock },
    { slug: 'recent-posts', block: RecentPostsBlock },
    { slug: 'mapBlock', block: MapBlock },
  ]

  return allBlocks.filter(({ slug }) => !exclude.includes(slug)).map(({ block }) => block(dbPrefix))
}
