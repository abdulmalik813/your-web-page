import type { Metadata } from 'next';
import { getServerSideURL } from './get-url';

/** 1200×630 branded card used when a page or article has no artwork of its own. */
export const DEFAULT_OG_IMAGE_PATH = '/og-default.jpg';

export interface SeoImage {
  url?: string | null;
  sizes?: { og?: { url?: string | null } };
}

export function getBaseUrl(): string {
  const url = getServerSideURL();
  if (!url) throw new Error('NEXT_PUBLIC_SERVER_URL is required');
  return url;
}

export function buildCanonicalUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${getBaseUrl()}${clean === '/' ? '' : clean}`;
}

/**
 * Resolve the best OG-sized URL from a Payload Media object.
 * Prefers the `og` image size (1200×630), falls back to the original URL.
 */
export function resolveOgImageUrl(mediaObj: SeoImage | null | undefined): string | undefined {
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
  fallbackImage,
  type = 'website',
  keywords,
  authors,
  publishedTime,
  modifiedTime,
  section,
  rss = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: SeoImage | null;
  fallbackImage?: SeoImage | null;
  type?: 'website' | 'article';
  keywords?: string[];
  authors?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  rss?: boolean;
}): Metadata {
  const url = buildCanonicalUrl(path);
  const ogImage = resolveOgImageUrl(image ?? fallbackImage) ?? buildCanonicalUrl(DEFAULT_OG_IMAGE_PATH);
  const isArticle = type === 'article';
  const cleanKeywords = keywords?.map((keyword) => keyword.trim()).filter(Boolean);

  return {
    title,
    description,
    ...(cleanKeywords?.length ? { keywords: cleanKeywords } : {}),
    ...(authors?.length ? { authors: authors.map((name) => ({ name })) } : {}),
    alternates: {
      canonical: url,
      ...(rss ? { types: { 'application/rss+xml': buildCanonicalUrl('/feed.xml') } } : {}),
    },
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
      ...(isArticle
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
            ...(authors?.length ? { authors } : {}),
            ...(section ? { section } : {}),
            ...(cleanKeywords?.length ? { tags: cleanKeywords } : {}),
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export const STATIC_ROUTES = [
  '/',
  '/services',
  '/our-work',
  '/newsletters',
  '/process',
  '/about',
  '/where-we-work',
  '/testimonials',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
] as const;

export interface SitemapItem {
  url: string;
  lastModified: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

/**
 * Static routes only. The live sitemap adds every CMS page and detail route
 * on top of these entries.
 */
export function getAllSitemapEntries(): SitemapItem[] {
  const now = new Date().toISOString();
  return STATIC_ROUTES.map((route) => ({
    url: `${getBaseUrl()}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}

export function absoluteUrl(path: string): string {
  return buildCanonicalUrl(path);
}
