import type { Metadata } from 'next';

export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) throw new Error('NEXT_PUBLIC_APP_URL is required');
  return raw.replace(/\/+$/, '');
}

export function buildCanonicalUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${getBaseUrl()}${clean === '/' ? '' : clean}`;
}

/**
 * Resolve the best OG-sized URL from a Payload Media object.
 * Prefers the `og` image size (1200×630), falls back to the original URL.
 */
export function resolveOgImageUrl(
  mediaObj: { url?: string | null; sizes?: { og?: { url?: string | null } } } | null | undefined,
): string | undefined {
  if (!mediaObj) return undefined;
  const base = getBaseUrl();
  const ogUrl = mediaObj.sizes?.og?.url;
  if (ogUrl) return ogUrl.startsWith('http') ? ogUrl : `${base}${ogUrl}`;
  if (mediaObj.url) return mediaObj.url.startsWith('http') ? mediaObj.url : `${base}${mediaObj.url}`;
  return undefined;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: { url?: string | null; sizes?: { og?: { url?: string | null } } } | null;
  type?: 'website' | 'article';
}): Metadata {
  const url = buildCanonicalUrl(path);
  const ogImage = resolveOgImageUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale: 'en_CA',
      type,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || title,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export const STATIC_ROUTES = ['/'] as const;

export interface SitemapItem {
  url: string;
  lastModified: string;
  changeFrequency: 'weekly' | 'monthly';
  priority: number;
}

export function getAllSitemapEntries(): SitemapItem[] {
  return STATIC_ROUTES.map((route) => ({
    url: `${getBaseUrl()}${route === '/' ? '' : route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
