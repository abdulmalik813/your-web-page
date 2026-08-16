import { getCachedGlobal } from '@/lib/get-globals'
import { NavigationBar, Setting } from '@/payload-types'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { MediaBlockUI } from '@/blocks/media'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { NavigationBlockUI } from '@/blocks/navigation'
import { NavigationBarWrapper } from '@/components/nav-menu/navigation-wrapper'
import { MobileMenu } from '@/components/nav-menu/mobile-menu'

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
    <Link href="/" prefetch={true} className="group flex items-center gap-2 shrink-0" aria-label="Home">
      <MediaBlockUI
        media={lightLogo}
        pageContext={pageContext}
        priority
        className={joinStyles('dark:hidden,', logoStyles)}
      />
      <MediaBlockUI
        media={darkLogo}
        priority
        pageContext={pageContext}
        className={joinStyles('hidden dark:block', logoStyles)}
      />
      {useTitleWithLogo && appTitle && (
        <span className={joinStyles('text-lg font-semibold tracking-tight', titleStyles)}>
          {appTitle}
        </span>
      )}
    </Link>
  )
}


export async function NavigationBarUI({ pageContext }: { pageContext: PageContext }) {
  const navBarData = (await getCachedGlobal('navigationBar', 1, pageContext.draft)) as NavigationBar
  const setting = (await getCachedGlobal('settings', 1, pageContext.draft)) as Setting

  const lightLogo = setting?.logo
  const darkLogo = setting?.logoDark ?? setting?.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  return (
    <NavigationBarWrapper
      hideWhenIdle={navBarData.hideWhenIdle}
      idleTimeout={navBarData.idleTimeout}
    >
      <Banner {...navBarData.banner} pageContext={pageContext} />
      <header
        className="sticky top-0 z-50 w-full bg-transparent"
        role="navigation"
      >
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center min-w-0 flex-shrink-0">
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
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors duration-200"
                        />
                      </NavigationMenuItem>
                    )
                  }

                  if (appearance === 'dropdown') {
                    return (
                      <NavigationMenuItem key={item.id}>
                        <NavigationMenuTrigger className={joinStyles(item?.nav?.styles)}>
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
                                  className="block rounded-md p-2.5 hover:bg-accent transition-colors duration-200 font-medium text-sm hover:text-primary"
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
                    className="text-base h-10 px-6 rounded-md transition-colors duration-200"
                  />
                ))}
              </div>
            )}
            <MobileMenu
              navBarData={navBarData}
              pageContext={pageContext}
            />
          </div>
        </div>
      </header>
    </NavigationBarWrapper>
  )
}
