import { getCachedGlobal } from '@/lib/get-globals'
import { Footer as FooterType, Setting } from '@/payload-types'
import Link from 'next/link'
import { MediaBlockUI } from '@/blocks/media'
import { NavigationBlockUI } from '@/blocks/navigation'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'

export async function Footer({ pageContext }: { pageContext: PageContext }) {
  const setting = (await getCachedGlobal('settings', 1, pageContext.draft)) as Setting
  const footerData = (await getCachedGlobal('footer', 1, pageContext.draft)) as FooterType

  const lightLogo = setting.logo
  const darkLogo = setting?.logoDark ?? setting.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  const numColumns = footerData.columns?.length || 0

  const getGridClass = () => {
    switch (numColumns) {
      case 1:
        return footerData.showLogo ? 'sm:grid-cols-2' : 'grid-cols-1'
      case 2:
        return footerData.showLogo ? 'sm:grid-cols-3' : 'grid-cols-2'
      case 3:
        return footerData.showLogo ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-3 lg:grid-cols-4'
      default:
        return footerData.showLogo ? 'sm:grid-cols-2' : 'grid-cols-1'
    }
  }

  return (
    <footer className="w-full mt-auto bg-transparent">
      <div className="w-full border-t border-border" />

      <div className="container mx-auto px-4 py-6">
        <div className={joinStyles('grid grid-cols-1 gap-6 lg:gap-8', getGridClass())}>
          {footerData.showLogo && (<div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <MediaBlockUI
                media={lightLogo}
                priority
                className={joinStyles('dark:hidden max-h-8 sm:max-h-10 w-auto object-contain max-w-[140px] sm:max-w-[200px] md:max-w-none', footerData.logoStyles)}
                pageContext={pageContext}
              />
              <MediaBlockUI
                media={darkLogo}
                className={joinStyles('hidden dark:block max-h-8 sm:max-h-10 w-auto object-contain max-w-[140px] sm:max-w-[200px] md:max-w-none', footerData.logoStyles)}
                pageContext={pageContext}
              />
              {footerData.useLabelWithLogo && setting.appTitle && (
                <span
                  className={joinStyles('text-xl font-bold tracking-tight', footerData.labelStyles)}
                >
                  {setting.appTitle}
                </span>
              )}
            </Link>
            {footerData.tagLine && (
              <div
                className={joinStyles('text-muted-foreground max-w-sm', footerData.tagLineStyles)}
              >
                <LexicalRenderer content={footerData.tagLine} pageContext={pageContext} />
              </div>
            )}
          </div>)}

          {footerData.columns?.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {column.groups?.map((group, groupIndex) => (
                <div key={groupIndex} className={joinStyles("flex flex-col gap-2", group.groupStyles)}>
                  {group.groupLabel && (
                    <h3
                      className={joinStyles(
                        'font-semibold text-sm uppercase tracking-wider text-foreground',
                        footerData.groupLabelStyles,
                      )}
                    >
                      {group.groupLabel}
                    </h3>
                  )}
                  <nav className="flex flex-col gap-1.5">
                    {group.items?.map((item, itemIndex) => (
                      <NavigationBlockUI
                        key={itemIndex}
                        {...item}
                        className={joinStyles(
                          'text-muted-foreground hover:text-foreground transition-colors text-sm',
                          footerData.linkStyles,
                        )}
                        pageContext={pageContext}
                      />
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-border" />

      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          © {new Date().getFullYear()} {setting.appTitle}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
