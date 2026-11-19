import type { Metadata } from 'next';

export function getBaseUrl(): string {
  const raw = process.env.APP_URL?.trim();
  if (!raw) throw new Error('APP_URL is required');
  return raw.replace(/\/+$/, '');
}

export function buildCanonicalUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${getBaseUrl()}${clean === '/' ? '' : clean}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  isHome = false,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  isHome?: boolean;
  type?: 'website' | 'article';
}): Metadata {
  const url = buildCanonicalUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: 'en_CA', type },
    twitter: { card: 'summary_large_image', title, description },
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
