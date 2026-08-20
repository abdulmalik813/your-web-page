import React from 'react'
import './theme.css'
import { draftMode } from 'next/headers'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { getServerSideURL } from '@/lib/get-url'
import { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/get-globals'
import { PreloadResources } from '@/app/(frontend)/preload-resources'
import { Metadata } from 'next'
import { getAppSettings } from '@/constants/app'
import { isFontData } from '@/lib/is-font-data'
import { LivePreviewListener } from '@/components/live-preview-listener'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from '@/components/ui/sonner'

export async function generateMetadata(): Promise<Metadata> {
  const appData = await getAppSettings()

  return {
    metadataBase: new URL(getServerSideURL()),
    description: appData.appDescription,
    title: appData.appTitle,
    openGraph: {
      locale: appData.locale,
      siteName: appData.appTitle,
    },
    icons: {
      icon: [
        ...(appData.favIcon ? [{ url: appData.favIcon, type: 'image/x-icon' as const }] : []),
        ...(appData.favIconPng ? [{ url: appData.favIconPng, type: 'image/png' as const }] : []),
        ...(appData.favIconSvg
          ? [{ url: appData.favIconSvg, type: 'image/svg+xml' as const }]
          : []),
      ],
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const { children } = props

  const setting = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  // In draft mode, append updatedAt as a cache-buster so:
  // 1. The URL differs from the production URL → no cross-contamination in browser cache
  // 2. Every draft save changes updatedAt → URL changes → browser re-fetches immediately
  // This makes live preview CSS changes reflect without a hard refresh.
  const stylesheetHref = isEnabled
    ? `/api/stylesheet?draft=1&t=${encodeURIComponent(setting?.updatedAt ?? '')}`
    : '/api/stylesheet'

  const defaultFont = setting?.default
  const fontData =
    defaultFont?.fontData && isFontData(defaultFont.fontData) ? defaultFont.fontData : null

  const defaultFontFamily = fontData?.variable
    ? `'${fontData.family} Variable', sans-serif`
    : fontData?.family
      ? `'${fontData.family}', sans-serif`
      : 'sans-serif'

  const fontWeight = fontData?.weight || 400
  const fontStyle = fontData?.style || 'normal'

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        fontFamily: defaultFontFamily,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
      }}
    >
      {isEnabled && <LivePreviewListener />}
      <body className="flex flex-col" suppressHydrationWarning>
        <PreloadResources href={stylesheetHref} />
        <link
          id="global-stylesheet"
          data-live-stylesheet="true"
          href={stylesheetHref}
          rel="stylesheet"
          precedence="default"
        />
        <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
