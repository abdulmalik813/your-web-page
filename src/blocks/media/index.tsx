import { MediaBlock } from '@/payload-types'
import { Media } from '@/components/media'
import { joinStyles } from '@/lib/make-styles'
import type { Media as MediaCollection } from '@/payload-types'
import Link from 'next/link'
import { getServerSideURL } from '@/lib/get-url'
import { Button } from '@/components/button'
import { browserPlayableTypes } from '@/constants/browser-media'
import { PageContext } from '@/types/page-context'

export function MediaBlockUI({
  pageContext,
  className,
  priority,
  ...mediaBlock
}: Partial<MediaBlock> & { className?: string } & { pageContext: PageContext } & {
  priority?: boolean | false
}) {
  if (!mediaBlock.media) return null

  const media: MediaCollection = mediaBlock.media as MediaCollection
  const isPlayable = browserPlayableTypes.includes(media.mimeType || '')

  if (isPlayable)
    return (
      <Media
        className={joinStyles(mediaBlock.wrapperStyles)}
        priority={priority}
        imgClassName={joinStyles(className, mediaBlock.contentStyles)}
        videoClassName={joinStyles(mediaBlock.contentStyles)}
        resource={media}
      />
    )

  return (
    <div className={joinStyles(mediaBlock.wrapperStyles)}>
      <Link href={getServerSideURL() + media.url}>
        <Button className={joinStyles(className, mediaBlock.contentStyles)}>
          {media?.caption}
        </Button>
      </Link>
    </div>
  )
}
