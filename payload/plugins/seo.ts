import { seoPlugin } from '@payloadcms/plugin-seo';
import { getServerSideURL } from '@/lib/get-url';

const collectionPrefixes: Record<string, string> = {
  pages: '',
  services: '/services/',
  projects: '/our-work/',
  newsletter: '/newsletters/',
  testimonials: '/testimonials/',
};

export function createSeoPlugin() {
  return seoPlugin({
    collections: ['pages', 'services', 'projects', 'newsletter', 'testimonials'],
    globals: ['settings'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) =>
      String(doc?.title || doc?.name || doc?.authorName || ''),
    generateDescription: ({ doc }) =>
      String(
        doc?.metaDescription ||
          doc?.excerpt ||
          doc?.summary ||
          doc?.description ||
          doc?.quote ||
          '',
      ),
    generateURL: ({ doc, collectionSlug }) => {
      if (!doc?.slug) return getServerSideURL();
      const prefix = collectionSlug ? collectionPrefixes[collectionSlug] : undefined;
      return `${getServerSideURL()}${prefix || '/'}${doc.slug}`;
    },
  });
}
