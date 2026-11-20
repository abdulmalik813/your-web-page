import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { MotionShell } from '@/components/MotionShell';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PayloadLivePreview } from '@/components/PayloadLivePreview';
import { PayloadAdminBar } from '@/components/PayloadAdminBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SiteBackground } from '@/components/SiteBackground';
import { getCmsFooter, getCmsNavigation, getCmsSettings } from '@/lib/cms';
import { buildCanonicalUrl, getBaseUrl, resolveOgImageUrl } from '@/lib/seo';
import { draftMode } from 'next/headers';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#f5f3ed',
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCmsSettings();
  const brand = settings?.brand || '';
  const description = settings?.meta?.description || '';
  const title = settings?.meta?.title || brand;
  const image = resolveOgImageUrl(settings?.meta?.image);
  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    icons: {
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
      other: [{ rel: 'mask-icon', url: '/brand/safari-pinned-tab.svg', color: '#f97316' }],
    },
    description,
    alternates: {
      canonical: buildCanonicalUrl('/'),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_CA',
      siteName: brand,
      url: buildCanonicalUrl('/'),
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode();
  const [settings, navigation, footer] = await Promise.all([
    getCmsSettings(draft),
    getCmsNavigation(draft),
    getCmsFooter(draft),
  ]);

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.brand,
    legalName: settings.legal?.entity,
    url: getBaseUrl(),
    email: settings.email,
    telephone: settings.schemaTelephone,
    description: settings.meta?.description || '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.location?.city,
      addressRegion: settings.location?.provinceCode,
      addressCountry: settings.location?.countryCode,
    },
    areaServed: (settings.areaServed || []).map((item: { label: string }) => item.label),
  };

  return (
    <html lang="en-CA" className={`${archivo.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans text-foreground" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SiteBackground />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
          <PayloadAdminBar draftEnabled={draft} />
          <SiteHeader settings={settings} navigation={navigation} />
          <main id="main" tabIndex={-1} className="relative z-10 w-full max-w-full overflow-x-clip outline-none">
            <MotionShell>{children}</MotionShell>
          </main>
          <SiteFooter settings={settings} footer={footer} />
          {draft && <PayloadLivePreview />}
        </ThemeProvider>
      </body>
    </html>
  );
}
