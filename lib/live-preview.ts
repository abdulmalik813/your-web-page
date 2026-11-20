import { createHmac } from 'node:crypto';

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
      case 'newsletter':
        route = rawSlug ? `/newsletters/${rawSlug}` : '/newsletters';
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

  const cleanPath = route.startsWith('/') ? route : `/${route}`;
  const safePath = cleanPath.replace(/^\/{2,}/, '/');
  // Public routes are static, so drafts are rendered by the dedicated
  // dynamic preview route that mirrors the public path.
  const previewPath = safePath === '/' ? '/preview' : `/preview${safePath}`;

  const params = new URLSearchParams({
    path: previewPath,
    previewSecret: getPreviewSecret(),
  });

  // Relative to the admin origin, so preview opens with the same session.
  return `/api/draft/enable?${params.toString()}`;
};

export const livePreviewBreakpoints = [
  { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
  { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
  { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
];
