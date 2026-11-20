import type { FaqItem, NewsletterEntry, Project, Service } from './cms';
import { absoluteUrl, DEFAULT_OG_IMAGE_PATH, getBaseUrl, resolveOgImageUrl, type SeoImage } from './seo';

type JsonLdNode = Record<string, unknown>;

export function organizationId(): string {
  return `${getBaseUrl()}/#organization`;
}

export function websiteId(): string {
  return `${getBaseUrl()}/#website`;
}

function postalAddress(settings: any): JsonLdNode | undefined {
  const location = settings?.location;
  if (!location?.city && !location?.country) return undefined;
  return {
    '@type': 'PostalAddress',
    ...(location.street ? { streetAddress: location.street } : {}),
    ...(location.city ? { addressLocality: location.city } : {}),
    ...(location.province ? { addressRegion: location.provinceCode || location.province } : {}),
    ...(location.postalCode ? { postalCode: location.postalCode } : {}),
    ...(location.countryCode || location.country
      ? { addressCountry: location.countryCode || location.country }
      : {}),
  };
}

function socialProfiles(settings: any): string[] {
  const social = settings?.social || {};
  return ['linkedin', 'github', 'instagram', 'x']
    .map((key) => social[key])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
}

export function organizationNode(settings: any): JsonLdNode {
  const base = getBaseUrl();
  // Google requires a publisher logo for article rich results, so fall back to the site icon.
  const logo = resolveOgImageUrl(settings?.meta?.image as SeoImage | undefined) || `${base}/icon.png`;
  const sameAs = socialProfiles(settings);
  const address = postalAddress(settings);
  const areaServed = (settings?.areaServed || [])
    .map((item: { label?: string }) => item?.label)
    .filter(Boolean);

  return {
    '@type': 'ProfessionalService',
    '@id': organizationId(),
    name: settings?.brand,
    ...(settings?.legal?.entity ? { legalName: settings.legal.entity } : {}),
    url: base,
    ...(settings?.meta?.description ? { description: settings.meta.description } : {}),
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.schemaTelephone ? { telephone: settings.schemaTelephone } : {}),
    ...(logo
      ? {
          image: logo,
          logo: {
            '@type': 'ImageObject',
            url: logo,
            ...(settings?.brand ? { caption: settings.brand } : {}),
          },
        }
      : {}),
    ...(address ? { address } : {}),
    ...(areaServed.length ? { areaServed } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings?.legal?.tradeNameStatement
      ? { disambiguatingDescription: settings.legal.tradeNameStatement }
      : {}),
    ...(settings?.domain ? { identifier: settings.domain } : {}),
  };
}

export function websiteNode(settings: any): JsonLdNode {
  const base = getBaseUrl();
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    url: base,
    name: settings?.brand,
    ...(settings?.meta?.description ? { description: settings.meta.description } : {}),
    publisher: { '@id': organizationId() },
    inLanguage: 'en-CA',
  };
}

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

export function serviceNode(service: Service, path: string): JsonLdNode {
  const url = absoluteUrl(path);
  const image = resolveOgImageUrl(service.image as SeoImage | undefined);
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.metaDescription || service.short,
    ...(image ? { image } : {}),
    provider: { '@id': organizationId() },
    areaServed: ['Prince Edward Island', 'Canada', 'Worldwide'],
    url,
    ...(service.included?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${service.title} scope`,
            itemListElement: service.included.map((item) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: item },
            })),
          },
        }
      : {}),
  };
}

export function projectNode(project: Project, path: string): JsonLdNode {
  const url = absoluteUrl(path);
  const image = resolveOgImageUrl(project.image as SeoImage | undefined);
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: project.title,
    description: project.summary,
    ...(image ? { image } : {}),
    url,
    creator: { '@id': organizationId() },
    ...(project.tags?.length ? { keywords: project.tags.join(', ') } : {}),
    ...(project.role ? { contributor: { '@type': 'Organization', name: project.role } } : {}),
    genre: project.type,
  };
}

export function faqNode(items: FaqItem[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function itemListNode({
  name,
  items,
  path,
}: {
  name: string;
  items: { title: string; slug: string; date?: string }[];
  path: string;
}): JsonLdNode {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#items`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: absoluteUrl(`${path.replace(/\/$/, '')}/${item.slug}`),
    })),
  };
}
