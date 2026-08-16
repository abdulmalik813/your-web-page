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
                <h1 className={joinStyles(hero.titleStyles)}>
                  {hero.title}
                </h1>
              )}

              {hero.description && (
                <p className={joinStyles(hero.descriptionStyles)}>
                  {hero.description}
                </p>
              )}

              {/* Action Buttons from DB */}
              {hero.actions && hero.actions.length > 0 && (
                <div className={joinStyles(hero.actionsStyles)}>
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
                <div className={joinStyles(cardData.cardStyles)}>
                  {/* Card Header */}
                  {(cardData.badgeText || cardData.heading || cardData.icon) && (
                    <div>
                      <div className="flex items-center justify-between">
                        {cardData.badgeText && (
                          <span className={joinStyles(cardData.badgeStyles)}>
                            {cardData.badgeText}
                          </span>
                        )}
                        {cardData.icon && (
                          <IconRender
                            icon={typeof cardData.icon === 'object' ? cardData.icon?.name ?? '' : ''}
                            iconStyles={joinStyles(cardData.iconStyles)}
                          />
                        )}
                      </div>
                      {cardData.heading && (
                        <h2 className={joinStyles(cardData.headingStyles)}>
                          {cardData.heading}
                        </h2>
                      )}
                    </div>
                  )}

                  {/* Feature Rows */}
                  {cardData.items && cardData.items.length > 0 && (
                    <div>
                      {cardData.items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className={joinStyles(item.itemStyles)}
                        >
                          {item.icon && (
                            <IconRender
                              icon={typeof item.icon === 'object' ? item.icon?.name ?? '' : ''}
                              iconStyles={joinStyles(item.iconStyles)}
                            />
                          )}
                          <div>
                            {item.title && (
                              <h3>
                                {item.title}
                              </h3>
                            )}
                            {item.description && (
                              <p>
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
