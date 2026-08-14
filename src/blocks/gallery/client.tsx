'use client'

import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import type { GalleryBlock, Media as MediaType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Media } from '@/components/media'
import { PageContext } from '@/types/page-context'
import { NavigationBlockUI } from '@/blocks/navigation'
import { Card } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { joinStyles } from '@/lib/make-styles'

interface GalleryBlockClientProps {
  galleryBlock: GalleryBlock
  pageContext: PageContext
}

export function GalleryBlockClient({ galleryBlock, pageContext }: GalleryBlockClientProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  )

  const selectedItem = selectedImage !== null ? galleryBlock.gallery?.[selectedImage] : null

  if (galleryBlock.format === 'grid') {
    return (
      <section className="mt-8">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
          {(galleryBlock.gallery ?? []).map((item, index) => {
            const resource = item.image
            const isVideo =
              resource && typeof resource === 'object' && resource.mimeType?.includes('video')

            return (
              <div key={index} className="break-inside-avoid">
                <div
                  className={cn('group relative overflow-hidden rounded-lg', {
                    'cursor-pointer': !isVideo,
                  })}
                  onClick={() => {
                    if (!isVideo) {
                      setSelectedImage(index)
                    }
                  }}
                >
                  <Media
                    resource={resource}
                    imgClassName="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    videoClassName="w-full h-auto object-cover"
                    autoPlay={false}
                    controls={true}
                    priority={true}
                    muted={false}
                    loop={false}
                    playsInline={false}
                  />
                  {!isVideo && <div className="absolute inset-0 group-hover:opacity-100" />}
                </div>
              </div>
            )
          })}
        </div>

        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-md text-foreground hover:bg-secondary transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <Media
                resource={selectedItem.image}
                imgClassName="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                videoClassName="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </section>
    )
  }

  if (galleryBlock.format === 'carousel') {
    return (
      <section>
        {galleryBlock.title && (
          <h2 className={joinStyles(galleryBlock.titleStyles)}>{galleryBlock.title}</h2>
        )}
        <div className="relative">
          <Carousel
            className="w-full"
            plugins={[autoplayPlugin.current]}
            opts={{
              loop: true,
              align: 'center',
            }}
          >
            <CarouselContent>
              {(galleryBlock.gallery ?? []).map((item, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden bg-muted p-0">
                    <div className="flex items-center justify-center h-[350px] md:h-[450px] lg:h-[500px]">
                      <Media
                        resource={item.image}
                        imgClassName="w-full h-full object-contain"
                        videoClassName="w-full h-full object-contain"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <div className="flex justify-center mt-6">
            <NavigationBlockUI {...galleryBlock} pageContext={pageContext} className="mx-auto" />
          </div>
        </div>
      </section>
    )
  }

  if (galleryBlock.format === 'focus') {
    return (
      <section className="mt-8">
        <Card className="overflow-hidden bg-muted p-0">
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
            {selectedItem ? (
              <Media
                resource={selectedItem.image}
                imgClassName="w-full h-full object-contain"
                videoClassName="w-full h-full object-contain"
                htmlElement={null}
                autoPlay={false}
                controls={true}
                muted={false}
                loop={false}
                priority={true}
              />
            ) : (
              galleryBlock.gallery?.[0] && (
                <Media
                  resource={galleryBlock.gallery[0].image}
                  imgClassName="w-full h-full object-contain"
                  videoClassName="w-full h-full object-contain"
                  htmlElement={null}
                  autoPlay={false}
                  controls={true}
                  muted={false}
                  loop={false}
                  priority={true}
                />
              )
            )}
          </div>
        </Card>

        <div className="overflow-hidden pt-4">
          <div className="flex gap-2 md:gap-3 overflow-x-auto">
            {galleryBlock.gallery?.map((item, index) => {
              const isSelected = selectedImage === index || (selectedImage === null && index === 0)
              const resource = item.image
              const isVideo =
                resource && typeof resource === 'object' && resource.mimeType?.includes('video')

              return (
                <div
                  key={index}
                  className={cn(
                    'relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden cursor-pointer transition-all border-2',
                    isSelected ? 'border-primary' : 'border-0 opacity-70 hover:opacity-100',
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Media
                    resource={
                      isVideo && typeof resource === 'object' ? resource.videoThumbnail : resource
                    }
                    imgClassName="w-full h-full object-cover"
                    videoClassName="w-full h-full object-cover"
                    htmlElement={null}
                    priority={true}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }
}
