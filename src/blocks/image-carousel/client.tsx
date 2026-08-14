'use client'

import { ImageCarouselBlock, Media as MediaType } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { Media } from '@/components/media'
import { useMemo } from 'react'

export function ImageCarouselBlockClient({
  pageContext,
  ...imageCarouselBlock
}: Partial<ImageCarouselBlock> & { pageContext: PageContext }) {
  const validMedias = useMemo(() => {
    return (imageCarouselBlock.medias || []).filter(
      (m): m is MediaType =>
        typeof m !== 'number' && m !== null && m !== undefined,
    )
  }, [imageCarouselBlock.medias])

  if (validMedias.length === 0) return null

  const duplicatedMedias = [...validMedias, ...validMedias]

  return (
    <section className="w-full overflow-hidden bg-background">
      <div className="relative w-full overflow-hidden">
        {/* gradients */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

        <div className="px-4 md:px-8 overflow-hidden">
          <div
            className="flex w-max gap-6 md:gap-8 lg:gap-12"
            style={{
              animation: `scroll ${validMedias.length * 6}s linear infinite`,
            }}
          >
            {duplicatedMedias.map((media, index) => (
              <div
                key={`${media.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ height: '120px' }}
              >
                <Media
                  resource={media}
                  imgClassName="h-[120px] w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}