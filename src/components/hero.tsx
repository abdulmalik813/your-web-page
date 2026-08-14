import { Page } from '@/payload-types'
import { CallToActionBlockUI } from '@/blocks/call-to-action'
import { CardBlockUI } from '@/blocks/card'
import { joinStyles } from '@/lib/make-styles'
import { Media } from '@/components/media'
import { PageContext } from '@/types/page-context'

export async function Hero({
  hero,
  pageContext,
}: {
  hero: NonNullable<Page['hero']>
  pageContext: PageContext
}) {
  if (hero.layout === 'with-image') {
    return <CallToActionBlockUI {...hero} pageContext={pageContext} />
  }

  if (hero.layout === 'fullscreen') {
    return (
      <section className={joinStyles('relative overflow-hidden', hero.fullscreenStyles)}>
        <div className="absolute inset-0 z-0">
          {hero.media && (
            <Media
              fill
              imgClassName="object-cover"
              priority
              resource={hero.media}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="relative z-10 hidden h-tall:grid md:grid-cols-2 h-full">
          <div className="relative md:hidden h-[30vh] min-h-[200px]" aria-hidden="true"></div>

          <div className="relative order-2 md:order-1 bg-background/90 backdrop-blur-sm flex items-center min-h-0 overflow-hidden">
            <div className="w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto max-h-[70vh] md:max-h-none">
              <div className="mx-auto max-w-2xl overflow-hidden">
                {hero.card && <CardBlockUI {...hero.card} pageContext={pageContext} />}
              </div>
            </div>
          </div>
          <div className="relative hidden md:block order-1 md:order-2" aria-hidden="true"></div>
        </div>

        <div className="relative z-10 hidden h-medium:grid h-tall:hidden md:grid-cols-2 h-full">
          <div className="relative md:hidden h-[25vh] min-h-[150px]" aria-hidden="true"></div>

          <div className="relative order-2 md:order-1 bg-background/90 backdrop-blur-sm flex items-center min-h-0 overflow-hidden">
            <div className="w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto max-h-[75vh] md:max-h-none">
              <div className="mx-auto max-w-2xl overflow-hidden">
                {hero.card && <CardBlockUI {...hero.card} pageContext={pageContext} />}
              </div>
            </div>
          </div>
          <div className="relative hidden md:block order-1 md:order-2" aria-hidden="true"></div>
        </div>

        <div className="relative z-10 h-medium:hidden flex flex-col h-full">
          <div className="relative h-[20vh] min-h-[120px]" aria-hidden="true"></div>

          <div className="relative flex-1 bg-background/90 backdrop-blur-sm flex items-center overflow-hidden">
            <div className="w-full py-3 sm:py-4 md:py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
              <div className="mx-auto max-w-2xl overflow-hidden">
                {hero.card && <CardBlockUI {...hero.card} pageContext={pageContext} />}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={joinStyles(hero.containerStyles)}>
      {hero.heroTitle && <h1 className={joinStyles(hero.heroTitleStyles)}>{hero.heroTitle}</h1>}
      {hero.heroDescription && (
        <p className={joinStyles(hero.heroDescriptionStyles)}>{hero.heroDescription}</p>
      )}
    </section>
  )
}
