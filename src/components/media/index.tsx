import React, { Fragment } from 'react'

import type { Props } from '@/components/media/types'
import { ImageMedia } from '@/components/media/image-media'
import { VideoMedia } from '@/components/media/video-media'

export function Media(props: Props) {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}