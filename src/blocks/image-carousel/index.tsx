import { ImageCarouselBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { ImageCarouselBlockClient } from '@/blocks/image-carousel/client'

export async function ImageCarouselBlockUI({
  pageContext,
  ...imageCarouselBlock
}: Partial<ImageCarouselBlock> & { pageContext: PageContext }) {
  return (
    <ImageCarouselBlockClient {...imageCarouselBlock} pageContext={pageContext} />
  )
}
