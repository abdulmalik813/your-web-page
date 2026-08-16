import { Page } from '@/payload-types'
import { CallToActionBlockUI } from '@/blocks/call-to-action'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'
import { NavigationBlockUI } from '@/blocks/navigation'
import { IconRender } from '@/components/renderer/icon-renderer'

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

  if (hero.layout === 'text-only') {
    return (
      <section className={joinStyles(hero.sectionStyles)}>
        {hero.title && (
          <h1 className={joinStyles(hero.titleStyles)}>
            {hero.title}
          </h1>
        )}
        {hero.description && (
          <p className={joinStyles(hero.descriptionStyles)}>
            {hero.description}
          </p>
        )}
      </section>
    )
  }

  if (hero.layout === 'home-page') {
    const cardData = hero.homePageCard

    return (
      <section className={joinStyles('w-full', hero.sectionStyles)}>
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline, Subtitle & Action Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {hero.title && (
                <h1 className={joinStyles('text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black uppercase tracking-tight text-foreground leading-[0.92] text-left break-words', hero.titleStyles)}>
                  {hero.title}
                </h1>
              )}

              {hero.description && (
                <p className={joinStyles('mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground font-normal max-w-2xl leading-relaxed text-left', hero.descriptionStyles)}>
                  {hero.description}
                </p>
              )}

              {/* Action Buttons from DB */}
              {hero.actions && hero.actions.length > 0 && (
                <div className={joinStyles('mt-8 sm:mt-10 flex flex-wrap items-center gap-4', hero.actionsStyles)}>
                  {hero.actions.map((action, index) => (
                    <NavigationBlockUI
                      key={action.id || index}
                      {...action}
                      pageContext={pageContext}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Structured Services Card from DB */}
            {cardData && (
              <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
                <div className={joinStyles('w-full max-w-lg bg-card text-card-foreground border border-border shadow-2xl overflow-hidden', cardData.cardStyles)}>
                  {/* Card Header */}
                  {(cardData.badgeText || cardData.heading || cardData.icon) && (
                    <div className="p-6 sm:p-7 border-b border-border bg-muted/30">
                      <div className="flex items-center justify-between">
                        {cardData.badgeText && (
                          <span className={joinStyles('text-[11px] font-bold uppercase tracking-widest text-accent', cardData.badgeStyles)}>
                            {cardData.badgeText}
                          </span>
                        )}
                        {cardData.icon && (
                          <IconRender
                            icon={typeof cardData.icon === 'object' ? cardData.icon?.name ?? '' : ''}
                            iconStyles={joinStyles('text-accent w-4 h-4 shrink-0', cardData.iconStyles)}
                          />
                        )}
                      </div>
                      {cardData.heading && (
                        <h2 className={joinStyles('mt-2 text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground', cardData.headingStyles)}>
                          {cardData.heading}
                        </h2>
                      )}
                    </div>
                  )}

                  {/* Feature Rows */}
                  {cardData.items && cardData.items.length > 0 && (
                    <div className="divide-y divide-border">
                      {cardData.items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className={joinStyles('p-6 sm:p-7 flex items-start gap-4 hover:bg-muted/40 transition-colors', item.itemStyles)}
                        >
                          {item.icon && (
                            <IconRender
                              icon={typeof item.icon === 'object' ? item.icon?.name ?? '' : ''}
                              iconStyles={joinStyles('mt-0.5 text-accent w-5 h-5 shrink-0', item.iconStyles)}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            {item.title && (
                              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                                {item.title}
                              </h3>
                            )}
                            {item.description && (
                              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return null
}
