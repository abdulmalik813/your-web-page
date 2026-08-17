'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/button'
import { TestimonialBlock, Testimonial } from '@/payload-types'
import { joinStyles } from '@/lib/make-styles'
import { NavigationBlockUI } from '@/blocks/navigation'
import { PageContext } from '@/types/page-context'
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Media } from '@/components/media'

export function TestimonialBlockClient({
  pageContext,
  ...testimonialBlock
}: Partial<TestimonialBlock> & { pageContext: PageContext }) {
  if (testimonialBlock.type === 'carousel')
    return <TestimonialCarousel testimonialBlock={testimonialBlock} pageContext={pageContext} />

  return <TestimonialGrid testimonialBlock={testimonialBlock} pageContext={pageContext} />
}

function TestimonialCarousel({
  testimonialBlock,
  pageContext,
}: {
  testimonialBlock: Partial<TestimonialBlock>
  pageContext: PageContext
}) {
  const [active, setActive] = useState(0)

  const validTestimonials = (testimonialBlock.testimonials || []).filter(
    (t): t is Testimonial => typeof t !== 'number',
  )

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % validTestimonials.length)
  }, [validTestimonials.length])

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + validTestimonials.length) % validTestimonials.length)
  }

  useEffect(() => {
    if (validTestimonials.length === 0) return
    const interval = setInterval(handleNext, 7000)
    return () => clearInterval(interval)
  }, [handleNext, validTestimonials.length])

  if (validTestimonials.length === 0) return null

  const getTitle = (testimonial: Testimonial) => {
    if (testimonial.type === 'individual') {
      return testimonial.name
    }
    return testimonial.company || testimonial.name
  }

  const getSubtitle = (testimonial: Testimonial) => {
    if (testimonial.type === 'individual') {
      return null
    }
    const parts = []
    if (testimonial.position) parts.push(testimonial.position)
    if (testimonial.name) parts.push(testimonial.name)
    return parts.length > 0 ? parts.join(' - ') : null
  }

  const truncateContent = (content: string) => {
    if (content.length <= 200) return content
    return content.substring(0, 200) + '...'
  }

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const getCardClasses = (index: number) => {
    const offset = (index - active + validTestimonials.length) % validTestimonials.length

    if (offset === 0) {
      return 'scale-100 rotate-0 translate-y-0 translate-x-0 opacity-100 z-30 blur-0'
    }
    if (offset === 1) {
      return 'scale-[0.96] rotate-[3deg] translate-y-[3%] translate-x-[2%] opacity-70 z-20 blur-[0.5px]'
    }
    if (offset === validTestimonials.length - 1) {
      return 'scale-[0.96] -rotate-[3deg] translate-y-[3%] -translate-x-[2%] opacity-0 z-10 blur-[1px]'
    }
    return 'scale-[0.85] rotate-[8deg] translate-y-[8%] opacity-0 z-[1] blur-[2px]'
  }

  return (
    <section className="mx-auto max-w-sm md:max-w-4xl md:px-8 lg:px-12">
      {testimonialBlock.title && (
        <h2 className={joinStyles(testimonialBlock.titleStyles)}>{testimonialBlock.title}</h2>
      )}

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20">
        <div className="md:hidden">
          <div className="relative h-auto w-full">
            {validTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ease-out ${index === active ? 'block' : 'hidden'}`}
              >
                <Card className="w-full shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-muted p-6 text-center">
                      <h3 className="text-xl font-bold text-foreground">{getTitle(testimonial)}</h3>
                      {getSubtitle(testimonial) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {getSubtitle(testimonial)}
                        </p>
                      )}
                      {testimonial.rating !== null && testimonial.rating !== undefined && (
                        <div className="flex items-center justify-center gap-1 mt-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={
                                i < (testimonial.rating || 0)
                                  ? 'h-4 w-4 fill-primary text-primary'
                                  : 'h-4 w-4 fill-muted text-muted-foreground'
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-background p-8 flex items-center justify-center">
                      {testimonial.avatar ? (
                        <div className="w-32 h-32">
                          <Media
                            resource={testimonial.avatar}
                            imgClassName="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                          {testimonial.name ? (
                            <span className="text-5xl font-bold text-muted-foreground">
                              {getInitial(testimonial.name)}
                            </span>
                          ) : (
                            <User className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-muted/50 p-6">
                      {testimonial.content && (
                        <p className="text-base text-foreground text-center">
                          {truncateContent(testimonial.content)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="relative h-80 w-full rounded-3xl">
            {validTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${getCardClasses(index)}`}
              >
                <Card
                  className={`h-full w-full shadow-lg flex items-center justify-center border-0 ${!testimonial.avatar ? 'bg-muted' : ''}`}
                >
                  <CardContent className="p-0 h-full w-full">
                    {testimonial.avatar ? (
                      <div className="flex h-full w-full items-center justify-center p-8">
                        <Media
                          resource={testimonial.avatar}
                          imgClassName="max-h-full max-w-full object-contain rounded-3xl"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-3xl">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-background/50">
                          {testimonial.name ? (
                            <span className="text-6xl font-bold text-muted-foreground">
                              {getInitial(testimonial.name)}
                            </span>
                          ) : (
                            <User className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="min-h-[280px] md:min-h-[320px] hidden md:block">
            <div className="flex items-center gap-3 min-h-[32px]">
              <h3 className="text-2xl font-bold text-foreground">
                {getTitle(validTestimonials[active])}
              </h3>
              {validTestimonials[active]?.rating !== null &&
                validTestimonials[active]?.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < (validTestimonials[active]?.rating || 0)
                            ? 'h-5 w-5 fill-primary text-primary'
                            : 'h-5 w-5 fill-muted text-muted-foreground'
                        }
                      />
                    ))}
                  </div>
                )}
            </div>

            <div className="mt-1 min-h-[20px]">
              {getSubtitle(validTestimonials[active]) && (
                <p className="text-sm text-muted-foreground">
                  {getSubtitle(validTestimonials[active])}
                </p>
              )}
            </div>

            <div className="mt-8 min-h-[160px]">
              {validTestimonials[active]?.content && (
                <p className="text-lg text-foreground">
                  {truncateContent(validTestimonials[active]?.content || '')}
                </p>
              )}
            </div>
          </div>

          <div className="hidden md:flex justify-center gap-4 md:justify-start">
            <Button
              onClick={handlePrev}
              variant="default"
              size="icon"
              className="group h-12 w-12"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
            </Button>
            <Button
              onClick={handleNext}
              variant="default"
              size="icon"
              className="group h-12 w-12"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-12" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:mt-6">
        <NavigationBlockUI {...testimonialBlock} pageContext={pageContext} />
      </div>
    </section>
  )
}

function TestimonialGrid({
  testimonialBlock,
  pageContext,
}: {
  testimonialBlock: Partial<TestimonialBlock>
  pageContext: PageContext
}) {
  const validTestimonials = (testimonialBlock.testimonials || []).filter(
    (t): t is Testimonial => typeof t !== 'number',
  )

  return (
    <section className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-8">
      {validTestimonials.map((testimonial) => (
        <div key={testimonial.id} className="mb-6 break-inside-avoid">
          <TestimonialCard testimonial={testimonial} />
        </div>
      ))}
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const getTitle = (testimonial: Testimonial) => {
    if (testimonial.type === 'individual') {
      return testimonial.name
    }
    return testimonial.company || testimonial.name
  }

  const getSubtitle = (testimonial: Testimonial) => {
    if (testimonial.type === 'individual') {
      return null
    }
    const parts = []
    if (testimonial.position) parts.push(testimonial.position)
    if (testimonial.name) parts.push(testimonial.name)
    return parts.length > 0 ? parts.join(' - ') : null
  }

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="aspect-square bg-muted flex items-center justify-center rounded-full w-16 h-16 shrink-0">
            {testimonial.avatar ? (
              <Media
                resource={testimonial.avatar}
                imgClassName="w-full h-full object-cover rounded-full"
              />
            ) : testimonial.name ? (
              <span className="text-2xl font-bold text-muted-foreground">
                {getInitial(testimonial.name)}
              </span>
            ) : (
              <User className="text-muted-foreground" size={32} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{getTitle(testimonial)}</h3>
            {getSubtitle(testimonial) && (
              <p className="text-sm text-muted-foreground">{getSubtitle(testimonial)}</p>
            )}
          </div>
        </div>

        {testimonial.rating !== null && testimonial.rating !== undefined && (
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < (testimonial.rating || 0)
                    ? 'h-5 w-5 fill-primary text-primary'
                    : 'h-5 w-5 fill-muted text-muted-foreground'
                }
              />
            ))}
          </div>
        )}

        <p className="text-foreground/80">{testimonial.content}</p>
      </CardContent>
    </Card>
  )
}
