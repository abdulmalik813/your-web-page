import type { GalleryBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { GalleryBlockClient } from '@/blocks/gallery/client'

export async function GalleryBlockUI({
  pageContext,
  ...galleryBlock
}: GalleryBlock & { pageContext: PageContext }) {
  return <GalleryBlockClient galleryBlock={galleryBlock} pageContext={pageContext} />
}1