import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getCmsPage, getCmsPages, getCmsProjectBySlug, getCmsProjects, getCmsNewsletterBySlug, getCmsNewsletters, getCmsSettings, getCmsServiceBySlug, getCmsServices } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';
import { CmsPageLayout } from './CmsPageLayout';
import { DetailPage } from './DetailPage';

/**
 * Pre-render every CMS page, service detail, project detail, and newsletter detail
 * as static HTML at build time. Next.js ISR handles revalidation automatically
 * via the cache tags set in cms.ts.
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const [pages, services, projects, newsletter] = await Promise.all([
      getCmsPages(),
      getCmsServices(),
      getCmsProjects(),
      getCmsNewsletters(),
    ]);

    const params: { slug: string[] }[] = [
      // Home page — empty slug array
      { slug: [] },
    ];

    for (const page of pages) {
      const s = String((page as { slug?: unknown }).slug ?? '');
      if (s && s !== 'home' && s !== 'newsletters') params.push({ slug: s.split('/') });
    }

    for (const service of services) {
      params.push({ slug: ['services', service.slug] });
    }

    for (const project of projects) {
      params.push({ slug: ['our-work', project.slug] });
    }

    for (const entry of newsletter) {
      params.push({ slug: ['newsletters', entry.slug] });
    }

    return params;
  } catch {
    // During local dev without a DB, fall back to dynamic rendering
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const { isEnabled: draft } = await draftMode();
  const [page, settings] = await Promise.all([getCmsPage(slug.join('/'), draft), getCmsSettings(draft)]);
  const fallbackImage = settings?.meta?.image;
  if (!page && slug.length === 2) {
    if (slug[0] === 'services') {
      const service = await getCmsServiceBySlug(slug[1], draft);
      if (service) return buildPageMetadata({
        title: service.meta?.title || service.title,
        description: service.meta?.description || service.metaDescription,
        path: `/services/${service.slug}`,
        image: service.image as { url?: string | null; sizes?: { og?: { url?: string | null } } } | null,
        fallbackImage,
        keywords: [service.title, 'Charlottetown', 'Prince Edward Island', 'Canada'],
      });
    }
    if (slug[0] === 'our-work') {
      const project = await getCmsProjectBySlug(slug[1], draft);
      if (project) return buildPageMetadata({
        title: project.meta?.title || project.title,
        description: project.meta?.description || project.summary,
        path: `/our-work/${project.slug}`,
        image: project.image as { url?: string | null; sizes?: { og?: { url?: string | null } } } | null,
        fallbackImage,
        keywords: [project.title, project.type, ...project.tags, 'Prince Edward Island'],
      });
    }
    if (slug[0] === 'newsletters') {
      const entry = await getCmsNewsletterBySlug(slug[1], draft);
      if (entry) return buildPageMetadata({
        title: entry.meta?.title || entry.title,
        description: entry.meta?.description || entry.excerpt,
        path: `/newsletters/${entry.slug}`,
        image: entry.image as { url?: string | null; sizes?: { og?: { url?: string | null } } } | null,
        fallbackImage,
        type: 'article',
        keywords: entry.tags,
        authors: [settings?.brand || 'Your Web Page'],
        publishedTime: new Date(`${entry.isoDate}T09:00:00-04:00`).toISOString(),
        modifiedTime: entry.updatedAt,
        section: entry.category,
        rss: true,
      });
    }
  }
  if (!page) return {};
  const meta = page.meta as { title?: string; description?: string; image?: { url?: string | null; sizes?: { og?: { url?: string | null } } } | null } | undefined;
  const hero = Array.isArray(page.layout)
    ? page.layout.find((block: { blockType?: string }) => block.blockType === 'hero')
    : undefined;
  return buildPageMetadata({
    title: meta?.title || page.title,
    description: meta?.description || hero?.lead || '',
    path: slug.length ? `/${slug.join('/')}` : '/',
    image: meta?.image,
    fallbackImage,
    keywords: [page.title, 'Charlottetown', 'Prince Edward Island', 'Canada'],
  });
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const { isEnabled: draft } = await draftMode();
  const page = await getCmsPage(slug.join('/'), draft);
  if (!page) return <DetailPage slug={slug} draft={draft} />;
  return <CmsPageLayout page={page} isHome={slug.length === 0} draft={draft} />;
}
