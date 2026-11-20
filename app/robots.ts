import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        // Longest match wins, so the media allow rule below overrides /api/
        // and lets Google crawl uploaded images served from /api/media/file/.
        allow: ['/', '/api/media/'],
        disallow: [
          '/admin',
          '/api/',
          '/api/graphql',
          '/api/form-submissions',
          '/api/newsletter/',
          '/api/seed',
          '/api/draft/',
          '/unsubscribe',
        ],
      },
    ],
    sitemap: [`${base}/sitemap.xml`, `${base}/news-sitemap.xml`],
  };
}
