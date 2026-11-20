import type { NewsletterEntry } from '@/lib/cms';
import type { JsonLdNode } from './types';
import { organizationId, websiteId } from './ids';
import { absoluteUrl, DEFAULT_OG_IMAGE_PATH, getBaseUrl, resolveOgImageUrl, type SeoImage } from '../seo';

export function webPageNode({
  path,
  title,
  description,
  image,
  type = 'WebPage',
  datePublished,
  dateModified,
}: {
  path: string;
  title: string;
  description?: string;
  image?: string;
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' | 'FAQPage';
  datePublished?: string;
  dateModified?: string;
}): JsonLdNode {
  const url = absoluteUrl(path);
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    ...(description ? { description } : {}),
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
    isPartOf: { '@id': websiteId() },
    inLanguage: 'en-CA',
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

export function breadcrumbNode(
  items: { label: string; href?: string }[],
  path: string,
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function articleNode({
  entry,
  settings,
  path,
}: {
  entry: NewsletterEntry & { updatedAt?: string };
  settings: any;
  path: string;
}): JsonLdNode {
  const url = absoluteUrl(path);
  const image = resolveOgImageUrl(entry.image as SeoImage | undefined) || `${getBaseUrl()}${DEFAULT_OG_IMAGE_PATH}`;
  const published = entry.isoDate ? new Date(`${entry.isoDate}T09:00:00-04:00`).toISOString() : undefined;
  const modified = entry.updatedAt ? new Date(entry.updatedAt).toISOString() : published;

  return {
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: entry.title,
    description: entry.excerpt,
    ...(image ? { image: [image] } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: {
      '@type': 'Organization',
      name: settings?.brand || 'Your Web Page',
      url: getBaseUrl(),
    },
    publisher: { '@id': organizationId() },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    articleSection: entry.category,
    ...(entry.tags?.length ? { keywords: entry.tags.join(', ') } : {}),
    isAccessibleForFree: true,
    inLanguage: 'en-CA',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'article p'],
    },
  };
}
