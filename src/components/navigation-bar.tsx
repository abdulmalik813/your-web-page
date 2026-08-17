import { getCachedGlobal } from '@/lib/get-globals'
import { NavigationBar, Setting } from '@/payload-types'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MediaBlockUI } from '@/blocks/media'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { NavigationBlockUI } from '@/blocks/navigation'
import { Button } from '@/components/button'

function Banner({
  pageContext,
  ...banner
}: Partial<NavigationBar['banner']> & { pageContext: PageContext }) {
  if (!banner.enableBanner) {
    return null
  }

  return (
    <div className={joinStyles(banner.bannerStyles)}>
      {banner.content && (
        <div className={joinStyles(banner.contentStyles)}>
          <LexicalRenderer content={banner.content} pageContext={pageContext} />
        </div>
      )}
    </div>
  )
}

function LogoLink({
  lightLogo,
  darkLogo,
  logoStyles,
  useTitleWithLogo,
  appTitle,
  titleStyles,
  pageContext,
}: {
  lightLogo: any
  darkLogo: any
  logoStyles?: NavigationBar['logoStyles']
  useTitleWithLogo?: boolean | null
  appTitle?: string | null
  titleStyles?: NavigationBar['titleStyles']
  pageContext: PageContext
}) {
  return (
    <Link
      href="/"
      prefetch={true}
      className="group flex items-center gap-2 min-w-0 max-w-full shrink transition-transform duration-200"
      aria-label="Home"
    >
      <MediaBlockUI
        media={lightLogo}
        pageContext={pageContext}
        priority
        className={joinStyles('dark:hidden', logoStyles)}
      />
      <MediaBlockUI
        media={darkLogo}
        priority
        pageContext={pageContext}
        className={joinStyles('hidden dark:block', logoStyles)}
      />
      {useTitleWithLogo && appTitle && (
        <span
          className={joinStyles(
            'text-lg font-semibold tracking-tight truncate shrink',
            titleStyles,
          )}
        >
          {appTitle}
        </span>
      )}
    </Link>
  )
}
function MobileMenu({
  navBarData,
  pageContext,
}: {
  navBarData: NavigationBar
  pageContext: PageContext
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-lg hover:bg-accent transition-colors duration-200"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        sideOffset={14}
        collisionPadding={16}
        className="w-[calc(100vw-2rem)] max-w-md max-h-[80vh] overflow-y-auto p-4 rounded-xl shadow-xl border bg-popover text-popover-foreground lg:hidden"
      >
        <nav className="space-y-3">
          <div className="space-y-1">
            {navBarData.navigation?.map((item, index) => {
              const appearance = item.nav?.appearance

              if (appearance === 'link' || appearance === 'button') {
                return (
                  <div key={item.id || index}>
                    <NavigationBlockUI
                      {...item}
                      pageContext={pageContext}
                      className="flex items-center w-full px-3 py-2"
                    />
                  </div>
                )
              }

              if (appearance === 'dropdown') {
                return (
                  <Accordion
                    key={item.id || index}
                    type="single"
                    collapsible
                    className="border-none"
                  >
                    <AccordionItem value={`item-${index}`} className="border-none">
                      <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg hover:no-underline transition-colors duration-200">
                        {item.nav?.label}
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pt-1">
                        <ul className="space-y-1 ml-2">
                          {item.nav?.items?.map((dropdownItem, i) => (
                            <li key={dropdownItem.id || i}>
                              <NavigationBlockUI
                                dropdownItem={dropdownItem}
                                pageContext={pageContext}
                                className="flex items-center w-full px-3 py-2"
                              />
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              }

              return null
            })}
          </div>

          {navBarData?.cta && navBarData.cta.length > 0 && (
            <div className="pt-3 border-t flex flex-col gap-2">
              {navBarData.cta.map((ctaItem, index) => (
                <NavigationBlockUI
                  key={ctaItem.id || index}
                  {...ctaItem}
                  pageContext={pageContext}
                  className="flex items-center w-full px-3 py-2"
                />
              ))}
            </div>
          )}
        </nav>
      </PopoverContent>
    </Popover>
  )
}

export async function NavigationBarUI({ pageContext }: { pageContext: PageContext }) {
  const navBarData = (await getCachedGlobal('navigationBar', 1, pageContext.draft)) as NavigationBar
  const setting = (await getCachedGlobal('settings', 1, pageContext.draft)) as Setting

  const lightLogo = setting?.logo
  const darkLogo = setting?.logoDark ?? setting?.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  return (
    <>
      <Banner {...navBarData.banner} pageContext={pageContext} />
      <header
        className={joinStyles(
          navBarData.stickyBar ? 'sticky' : '',
          'top-0 z-50 w-full bg-background text-foreground border-b border-border',
        )}
        role="navigation"
      >
        <div className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center min-w-0 shrink">
            <LogoLink
              lightLogo={lightLogo}
              darkLogo={darkLogo}
              logoStyles={navBarData.logoStyles}
              useTitleWithLogo={navBarData.useTitleWithLogo}
              appTitle={setting.appTitle}
              titleStyles={navBarData.titleStyles}
              pageContext={pageContext}
            />
          </div>

          <nav className="hidden lg:flex flex-1 items-center justify-center max-w-3xl">
            <NavigationMenu viewport={false} suppressHydrationWarning>
              <NavigationMenuList className="gap-1">
                {navBarData.navigation?.map((item) => {
                  const appearance = item.nav?.appearance

                  if (appearance === 'link' || appearance === 'button') {
                    return (
                      <NavigationMenuItem key={item.id}>
                        <NavigationBlockUI
                          {...item}
                          pageContext={pageContext}
                        />
                      </NavigationMenuItem>
                    )
                  }

                  if (appearance === 'dropdown') {
                    return (
                      <NavigationMenuItem key={item.id}>
                        <NavigationMenuTrigger
                          className={joinStyles(
                            item?.nav?.styles
                          )}
                        >
                          {item.nav?.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="left-0">
                          <ul
                            className={joinStyles(
                              'grid gap-1 p-2  grid-cols-1',
                              item.nav?.listStyle,
                            )}
                          >
                            {item.nav?.items?.map((dropdownItem) => (
                              <li key={dropdownItem.id}>
                                <NavigationBlockUI
                                  dropdownItem={dropdownItem}
                                  pageContext={pageContext}
                                />
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )
                  }

                  return null
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            {navBarData?.cta && navBarData.cta.length > 0 && (
              <div className="hidden sm:flex gap-2">
                {navBarData.cta.map((ctaItem, index) => (
                  <NavigationBlockUI
                    key={ctaItem.id || index}
                    {...ctaItem}
                    pageContext={pageContext}
                  />
                ))}
              </div>
            )}
            <MobileMenu navBarData={navBarData} pageContext={pageContext} />
          </div>
        </div>
      </header>
      </ >
  )
}
