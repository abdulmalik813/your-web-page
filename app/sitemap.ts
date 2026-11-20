import type { MetadataRoute } from 'next';
import { unstable_cache } from 'next/cache';
import { getCmsPages, getCmsProjects, getCmsNewsletters, getCmsServices } from '@/lib/cms';
import { getBaseUrl } from '@/lib/seo';

const getCachedSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const base = getBaseUrl();
    const [pages, services, projects, newsletter] = await Promise.all([
      getCmsPages(),
      getCmsServices(),
      getCmsProjects(),
      getCmsNewsletters(),
    ]);

    const entries: MetadataRoute.Sitemap = pages.map((page) => {
      const route = page.slug === 'home' ? '/' : `/${page.slug}`;
      return {
        url: `${base}${route === '/' ? '' : route}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: route === '/' ? 1 : 0.8,
      };
    });

    for (const service of services) {
      entries.push({
        url: `${base}/services/${service.slug}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.85,
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${base}/our-work/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    for (const entry of newsletter) {
      entries.push({
        url: `${base}/newsletters/${entry.slug}`,
        lastModified: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    }

    return entries;
  },
  ['cms-sitemap'],
  { tags: ['site-sitemap'] },
);

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getCachedSitemap();
}
