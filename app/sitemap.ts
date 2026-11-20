import type { MetadataRoute } from 'next';
import { getCmsNewsletters, getCmsPages, getCmsProjects, getCmsServices } from '@/lib/cms';
import { getBaseUrl } from '@/lib/seo';

/**
 * Prerendered at build time, then revalidated hourly or whenever CMS content
 * changes (the collection hooks call revalidatePath('/sitemap.xml')).
 */
export const dynamic = 'force-static';
export const revalidate = 3600;

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const [pages, services, projects, newsletters] = await Promise.all([
    getCmsPages(),
    getCmsServices(),
    getCmsProjects(),
    getCmsNewsletters(),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const absoluteImage = (url?: string | null): string[] | undefined => {
    if (!url) return undefined;
    return [url.startsWith('http') ? url : `${base}${url.startsWith('/') ? url : `/${url}`}`];
  };

  const add = (
    path: string,
    lastModified: string | Date | undefined,
    changeFrequency: SitemapEntry['changeFrequency'],
    priority: number,
    images?: string[],
  ) => {
    const url = `${base}${path === '/' ? '' : path}`;
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
      changeFrequency,
      priority,
      ...(images?.length ? { images } : {}),
    });
  };

  const home = pages.find((page: any) => page.slug === 'home');

  add('/', home?.updatedAt, 'daily', 1);

  for (const page of pages as any[]) {
    const slug = typeof page.slug === 'string' ? page.slug.trim() : '';
    if (!slug || slug === 'home') continue;
    add(`/${slug}`, page.updatedAt, slug === 'newsletters' ? 'daily' : 'weekly', 0.8);
  }

  for (const service of services) {
    add(`/services/${service.slug}`, service.updatedAt, 'monthly', 0.85, absoluteImage(service.image?.url));
  }

  for (const project of projects) {
    add(`/our-work/${project.slug}`, project.updatedAt, 'monthly', 0.7, absoluteImage(project.image?.url));
  }

  for (const entry of newsletters) {
    add(
      `/newsletters/${entry.slug}`,
      entry.updatedAt ?? entry.isoDate,
      'weekly',
      0.75,
      absoluteImage(entry.image?.url),
    );
  }

  return entries;
}
