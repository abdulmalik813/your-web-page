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
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import NextTopLoader from 'nextjs-toploader'

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
    ...((appData.googleVerification || appData.bingVerification || appData.yandexVerification) && {
      verification: {
        ...(appData.googleVerification && { google: appData.googleVerification }),
        ...((appData.bingVerification || appData.yandexVerification) && {
          other: {
            ...(appData.bingVerification && { 'msvalidate.01': [appData.bingVerification] }),
            ...(appData.yandexVerification && {
              'yandex-verification': [appData.yandexVerification],
            }),
          },
        }),
      },
    }),
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const { children } = props

  const setting = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

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
        <PreloadResources />
        <link href="/api/stylesheet" rel="stylesheet" precedence="default" />
        <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        {setting.googleAnalyticsId && <GoogleAnalytics gaId={setting.googleAnalyticsId} />}
        {setting.microsoftClarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${setting.microsoftClarityId}");
            `}
          </Script>
        )}
        <Analytics />
      </body>
    </html>
  )
}
