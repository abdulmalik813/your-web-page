import type { JsonLdNode } from './types';
import { organizationId, websiteId } from './ids';
import { getBaseUrl, resolveOgImageUrl, type SeoImage } from '../seo';

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
