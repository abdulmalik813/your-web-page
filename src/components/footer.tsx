import { getCachedGlobal } from '@/lib/get-globals'
import { Footer as FooterType, Setting } from '@/payload-types'
import Link from 'next/link'
import { NavigationBlockUI } from '@/blocks/navigation'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'
import { MediaBlockUI } from '@/blocks/media'

export async function Footer({ pageContext }: { pageContext: PageContext }) {
  const setting = (await getCachedGlobal('settings', 1, pageContext.draft)) as Setting
  const footerData = (await getCachedGlobal('footer', 1, pageContext.draft)) as FooterType

  const lightLogo = setting?.logo
  const darkLogo = setting?.logoDark ?? setting?.logo

  const hasLogo = typeof lightLogo === 'object' && typeof darkLogo === 'object'

  return (
    <footer className="w-full mt-auto bg-background text-foreground py-8 lg:py-12 border-t-4 border-primary">
      <div className="container mx-auto px-4 max-w-7xl">
        {hasLogo && (
          <div className="mb-12 lg:mb-16">
            <Link
              href="/"
              prefetch={true}
              className="group inline-flex items-center"
              aria-label="Home"
            >
              <MediaBlockUI
                media={lightLogo}
                pageContext={pageContext}
                className="dark:hidden"
              />

              <MediaBlockUI
                media={darkLogo}
                pageContext={pageContext}
                className="hidden dark:block"
              />
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-12 lg:gap-8 lg:mt-4">
          <div className="flex flex-col gap-6 max-w-2xl w-full">
            {footerData.tagLine && (
              <div className="text-sm md:text-base text-muted-foreground [&_p]:mb-2 [&_p]:last:mb-0 space-y-2 font-medium tracking-wide">
                <LexicalRenderer content={footerData.tagLine} pageContext={pageContext} />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end lg:items-end gap-12 lg:gap-8 w-full">
            <div className="flex flex-wrap gap-x-6 gap-y-4 lg:justify-end">
              {footerData.links?.map((item, itemIndex) => (
                <NavigationBlockUI
                  key={itemIndex}
                  {...item}
                  className={joinStyles(
                    footerData.linkStyles,
                  )}
                  pageContext={pageContext}
                />
              ))}
            </div>

            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-left lg:text-right">
              © {new Date().getFullYear()} {setting.appTitle}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}