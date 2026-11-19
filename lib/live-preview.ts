import { createHmac } from 'node:crypto';

const previewBase = () => {
  const appUrl = process.env.APP_URL?.trim();
  if (!appUrl) throw new Error('APP_URL is required for live preview');
  return appUrl.replace(/\/+$/, '');
};

export function getPreviewSecret(): string {
  const payloadSecret = process.env.PAYLOAD_SECRET?.trim();
  if (!payloadSecret) throw new Error('PAYLOAD_SECRET is required for live preview');
  return createHmac('sha256', payloadSecret).update('payload-live-preview').digest('hex');
}

export const livePreviewUrl = (args: { data: Record<string, any>; collectionSlug?: string; globalSlug?: string }) => {
  const { data, collectionSlug, globalSlug } = args;
  const routes: Record<string, string> = {
    pages: data?.slug === 'home' ? '/' : `/${data?.slug || ''}`,
    services: `/services/${data?.slug || ''}`,
    projects: `/our-work/${data?.slug || ''}`,
    resources: `/resources/${data?.slug || ''}`,
    faqs: '/faq',
    testimonials: '/',
  };
  const route = collectionSlug ? routes[collectionSlug] : globalSlug ? '/' : '/';
  const params = new URLSearchParams({
    path: route,
    previewSecret: getPreviewSecret(),
  });
  return `${previewBase()}/api/draft/enable?${params.toString()}`;
};

export const livePreviewBreakpoints = [
  { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
  { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
  { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
];
