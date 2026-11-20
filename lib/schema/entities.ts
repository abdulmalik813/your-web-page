import type { FaqItem, Project, Service } from '@/lib/cms';
import type { JsonLdNode } from './types';
import { organizationId } from './ids';
import { absoluteUrl, resolveOgImageUrl, type SeoImage } from '../seo';

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
