import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { MotionShell } from '@/components/MotionShell';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PayloadLivePreview } from '@/components/PayloadLivePreview';
import { PayloadAdminBar } from '@/components/PayloadAdminBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SiteBackground } from '@/components/SiteBackground';
import { getCmsFooter, getCmsNavigation, getCmsServices, getCmsSettings } from '@/lib/cms';
import { buildCanonicalUrl, getBaseUrl } from '@/lib/seo';
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
  return {
    metadataBase: new URL(getBaseUrl()),
    title,
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode();
  const previewServerURL =
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, '') || getBaseUrl();
  const [settings, navigation, footer, services] = await Promise.all([
    getCmsSettings(draft),
    getCmsNavigation(draft),
    getCmsFooter(draft),
    getCmsServices(draft),
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
          <SiteHeader settings={settings} navigation={navigation} services={services} />
          <main id="main" tabIndex={-1} className="relative z-10 w-full max-w-full overflow-x-clip outline-none">
            <MotionShell>{children}</MotionShell>
          </main>
          <SiteFooter settings={settings} footer={footer} />
          <PayloadLivePreview serverURL={previewServerURL} />
        </ThemeProvider>
      </body>
    </html>
  );
}
