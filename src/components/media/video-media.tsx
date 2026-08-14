import { cn } from '@/lib/utils'
import React from 'react'

import type { Props as MediaProps } from '@/components/media/types'
import { getMediaUrl } from '@/lib/get-media-url'

export function VideoMedia(props: MediaProps) {
  const {
    onClick,
    resource,
    videoClassName,
    autoPlay = true,
    controls = true,
    loop = true,
    muted = true,
    playsInline = true,
  } = props

  if (resource && typeof resource === 'object') {
    const thumbnailUrl = resource.videoThumbnail 
      ? getMediaUrl(
          typeof resource.videoThumbnail === 'object' 
            ? resource.videoThumbnail.url 
            : undefined
        )
      : undefined

    return (
      <video
        src={getMediaUrl(resource.url)}
        poster={thumbnailUrl}
        autoPlay={autoPlay}
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onClick={onClick}
        className={cn(videoClassName)}
      />
    )
  }

  return null
}