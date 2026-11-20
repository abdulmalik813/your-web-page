import { createHmac } from 'node:crypto';
import { getBaseUrl } from './seo';

const previewBase = getBaseUrl;

export function getPreviewSecret(): string {
  const payloadSecret = process.env.PAYLOAD_SECRET?.trim() || 'default-secret-fallback';
  return createHmac('sha256', payloadSecret).update('payload-live-preview').digest('hex');
}

export interface LivePreviewUrlArgs {
  data?: Record<string, any> | null;
  collectionSlug?: string;
  globalSlug?: string;
  collectionConfig?: { slug?: string };
  globalConfig?: { slug?: string };
}

export const livePreviewUrl = (args: LivePreviewUrlArgs = {}) => {
  const { data, collectionSlug, globalSlug, collectionConfig, globalConfig } = args;
  const colSlug = collectionSlug || collectionConfig?.slug;
  const globSlug = globalSlug || globalConfig?.slug;

  const rawSlug = typeof data?.slug === 'string' ? data.slug.trim().replace(/^\/+/, '') : '';

  let route = '/';

  if (colSlug) {
    switch (colSlug) {
      case 'pages':
        route = !rawSlug || rawSlug === 'home' ? '/' : `/${rawSlug}`;
        break;
      case 'services':
        route = rawSlug ? `/services/${rawSlug}` : '/services';
        break;
      case 'projects':
        route = rawSlug ? `/our-work/${rawSlug}` : '/our-work';
        break;
      case 'resources':
        route = rawSlug ? `/resources/${rawSlug}` : '/resources';
        break;
      case 'faqs':
        route = '/faq';
        break;
      case 'testimonials':
        route = '/testimonials';
        break;
      case 'media':
      case 'users':
      default:
        route = '/';
        break;
    }
  } else if (globSlug) {
    switch (globSlug) {
      case 'footer':
      case 'navigation':
      case 'settings':
      default:
        route = '/';
        break;
    }
  }

  // Ensure path is strictly single leading slash and valid
  const cleanPath = route.startsWith('/') ? route : `/${route}`;
  const safePath = cleanPath.replace(/^\/{2,}/, '/');

  const params = new URLSearchParams({
    path: safePath,
    previewSecret: getPreviewSecret(),
  });

  return `${previewBase()}/api/draft/enable?${params.toString()}`;
};

export const livePreviewBreakpoints = [
  { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
  { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
  { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
];
