import { unstable_cache } from 'next/cache';
import config from '@payload-config';
import { getPayload, type Payload } from 'payload';

export type ProjectType = 'Website' | 'Software' | 'SaaS';
export type ResourceCategory = 'Guide' | 'Checklist' | 'Tutorial' | 'Case Study' | 'Notes';

export interface MediaAsset {
  url: string;
  alt: string;
}

export interface Service {
  slug: string;
  title: string;
  image: MediaAsset | null;
  short: string;
  metaDescription: string;
  intro: string;
  overview: string[];
  included: string[];
  forWho: string[];
  steps: { title: string; description: string }[];
  meta?: { title?: string | null; description?: string | null };
  updatedAt?: string;
}

export interface Project {
  slug: string;
  title: string;
  type: ProjectType;
  tags: string[];
  image: MediaAsset | null;
  role: string;
  summary: string;
  challenge: string;
  approach: string;
  outcomes: string[];
  meta?: { title?: string | null; description?: string | null };
  updatedAt?: string;
}

export interface ResourceSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ResourceEntry {
  slug: string;
  title: string;
  image: MediaAsset | null;
  excerpt: string;
  category: ResourceCategory;
  tags: string[];
  publishDate: string;
  isoDate: string;
  readTime: number;
  sections: ResourceSection[];
  meta?: { title?: string | null; description?: string | null };
  updatedAt?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  featuredOnHome?: boolean;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  roleAndCompany: string;
  location: string;
  approved: boolean;
}

async function getPayloadClient(): Promise<Payload> {
  return getPayload({ config });
}

function textRows(rows: unknown): string[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) =>
      typeof row === 'object' && row !== null && 'text' in row
        ? String((row as { text: unknown }).text)
        : '',
    )
    .filter(Boolean);
}

function tagRows(rows: unknown): string[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) =>
      typeof row === 'object' && row !== null && 'tag' in row
        ? String((row as { tag: unknown }).tag)
        : '',
    )
    .filter(Boolean);
}

function metaFields(value: unknown): { title?: string | null; description?: string | null } | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
  const meta = value as Record<string, unknown>;
  return {
    title: typeof meta.title === 'string' ? meta.title : undefined,
    description: typeof meta.description === 'string' ? meta.description : undefined,
  };
}

function mediaAsset(value: unknown): MediaAsset | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const media = value as Record<string, unknown>;
  if (typeof media.url !== 'string' || !media.url) return null;
  return {
    url: media.url,
    alt: typeof media.alt === 'string' ? media.alt : '',
  };
}

function toService(value: unknown): Service {
  const doc = value as Record<string, unknown>;
  return {
    slug: String(doc.slug),
    title: String(doc.title),
    image: mediaAsset(doc.image),
    short: String(doc.short),
    metaDescription: String(doc.metaDescription),
    intro: String(doc.intro),
    overview: textRows(doc.overview),
    included: textRows(doc.included),
    forWho: textRows(doc.forWho),
    steps: Array.isArray(doc.steps)
      ? doc.steps.map((row) => {
          const step = row as { title?: unknown; description?: unknown };
          return {
            title: String(step.title ?? ''),
            description: String(step.description ?? ''),
          };
        })
      : [],
    meta: metaFields(doc.meta),
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
  };
}

function toProject(value: unknown): Project {
  const doc = value as Record<string, unknown>;
  return {
    slug: String(doc.slug),
    title: String(doc.title),
    type: String(doc.type) as ProjectType,
    tags: tagRows(doc.tags),
    image: mediaAsset(doc.image),
    role: String(doc.role),
    summary: String(doc.summary),
    challenge: String(doc.challenge),
    approach: String(doc.approach),
    outcomes: textRows(doc.outcomes),
    meta: metaFields(doc.meta),
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
  };
}

function toResource(value: unknown): ResourceEntry {
  const doc = value as Record<string, unknown>;
  const sections = Array.isArray(doc.sections) ? doc.sections : [];
  return {
    slug: String(doc.slug),
    title: String(doc.title),
    image: mediaAsset(doc.image),
    excerpt: String(doc.excerpt),
    category: String(doc.category) as ResourceCategory,
    tags: tagRows(doc.tags),
    publishDate: String(doc.publishDate),
    isoDate: String(doc.isoDate),
    readTime: Number(doc.readTime),
    sections: sections.map((row) => {
      const section = row as { heading?: unknown; paragraphs?: unknown; bullets?: unknown };
      return {
        heading: section.heading ? String(section.heading) : undefined,
        paragraphs: textRows(section.paragraphs),
        bullets: textRows(section.bullets),
      };
    }),
    meta: metaFields(doc.meta),
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
  };
}

async function queryServices(draft = false): Promise<Service[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'services',
    draft,
    depth: 1,
    sort: 'sortOrder',
    limit: 100,
    overrideAccess: draft,
  });
  return result.docs.map(toService);
}

const getCachedServices = unstable_cache(queryServices, ['cms-services'], {
  tags: ['collection-services'],
});

export function getCmsServices(draft = false): Promise<Service[]> {
  return draft ? queryServices(true) : getCachedServices();
}

async function queryServiceBySlug(slug: string, draft = false): Promise<Service | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'services',
    draft,
    depth: 1,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: draft,
  });
  return result.docs[0] ? toService(result.docs[0]) : undefined;
}

export function getCmsServiceBySlug(slug: string, draft = false): Promise<Service | undefined> {
  if (draft) return queryServiceBySlug(slug, true);
  return unstable_cache(() => queryServiceBySlug(slug), ['cms-service', slug], {
    tags: ['collection-services'],
  })();
}

async function queryProjects(draft = false): Promise<Project[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'projects',
    draft,
    depth: 1,
    sort: 'sortOrder',
    limit: 100,
    overrideAccess: draft,
  });
  return result.docs.map(toProject);
}

const getCachedProjects = unstable_cache(queryProjects, ['cms-projects'], {
  tags: ['collection-projects'],
});

export function getCmsProjects(draft = false): Promise<Project[]> {
  return draft ? queryProjects(true) : getCachedProjects();
}

async function queryProjectBySlug(slug: string, draft = false): Promise<Project | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'projects',
    draft,
    depth: 1,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: draft,
  });
  return result.docs[0] ? toProject(result.docs[0]) : undefined;
}

export function getCmsProjectBySlug(slug: string, draft = false): Promise<Project | undefined> {
  if (draft) return queryProjectBySlug(slug, true);
  return unstable_cache(() => queryProjectBySlug(slug), ['cms-project', slug], {
    tags: ['collection-projects'],
  })();
}

async function queryResources(draft = false): Promise<ResourceEntry[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'resources',
    draft,
    depth: 1,
    sort: 'sortOrder',
    limit: 100,
    overrideAccess: draft,
  });
  return result.docs.map(toResource);
}

const getCachedResources = unstable_cache(queryResources, ['cms-resources'], {
  tags: ['collection-resources'],
});

export function getCmsResources(draft = false): Promise<ResourceEntry[]> {
  return draft ? queryResources(true) : getCachedResources();
}

async function queryResourceBySlug(slug: string, draft = false): Promise<ResourceEntry | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'resources',
    draft,
    depth: 1,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: draft,
  });
  return result.docs[0] ? toResource(result.docs[0]) : undefined;
}

export function getCmsResourceBySlug(slug: string, draft = false): Promise<ResourceEntry | undefined> {
  if (draft) return queryResourceBySlug(slug, true);
  return unstable_cache(() => queryResourceBySlug(slug), ['cms-resource', slug], {
    tags: ['collection-resources'],
  })();
}

async function queryFaqGroups(draft = false): Promise<FaqGroup[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'faqs',
    draft,
    sort: 'sortOrder',
    limit: 200,
    overrideAccess: draft,
  });
  const groups = new Map<string, FaqItem[]>();

  for (const value of result.docs) {
    const doc = value as unknown as Record<string, unknown>;
    const title = String(doc.groupTitle);
    const item: FaqItem = {
      id: String(doc.keyId || doc.id),
      question: String(doc.question),
      answer: String(doc.answer),
      featuredOnHome: Boolean(doc.featuredOnHome),
    };
    groups.set(title, [...(groups.get(title) || []), item]);
  }

  return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
}

const getCachedFaqGroups = unstable_cache(queryFaqGroups, ['cms-faq-groups'], {
  tags: ['collection-faqs'],
});

export function getCmsFaqGroups(draft = false): Promise<FaqGroup[]> {
  return draft ? queryFaqGroups(true) : getCachedFaqGroups();
}

export async function getCmsFeaturedFaqs(draft = false): Promise<FaqItem[]> {
  return (await getCmsFaqGroups(draft))
    .flatMap((group) => group.items)
    .filter((item) => item.featuredOnHome);
}

async function queryApprovedTestimonials(draft = false): Promise<Testimonial[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'testimonials',
    draft,
    where: { approved: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
    overrideAccess: draft,
  });
  return result.docs.map((value) => {
    const doc = value as unknown as Record<string, unknown>;
    return {
      id: String(doc.keyId || doc.id),
      quote: String(doc.quote),
      authorName: String(doc.authorName),
      roleAndCompany: String(doc.roleAndCompany),
      location: String(doc.location),
      approved: Boolean(doc.approved),
    };
  });
}

const getCachedApprovedTestimonials = unstable_cache(queryApprovedTestimonials, ['cms-testimonials'], {
  tags: ['collection-testimonials'],
});

export function getCmsApprovedTestimonials(draft = false): Promise<Testimonial[]> {
  return draft ? queryApprovedTestimonials(true) : getCachedApprovedTestimonials();
}

async function queryPage(slug: string, draft = false): Promise<any | null> {
  const payload = await getPayloadClient();
  const normalized = slug.replace(/^\/+|\/+$/g, '') || 'home';
  const result = await payload.find({
    collection: 'pages',
    draft,
    where: { slug: { equals: normalized } },
    limit: 1,
    overrideAccess: draft,
  });
  return result.docs[0] || null;
}

export function getCmsPage(slug: string, draft = false): Promise<any | null> {
  if (draft) return queryPage(slug, true);
  const normalized = slug.replace(/^\/+|\/+$/g, '') || 'home';
  return unstable_cache(() => queryPage(normalized), ['cms-page', normalized], {
    tags: ['collection-pages'],
  })();
}

async function querySettings(draft = false): Promise<any> {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: 'settings', draft, overrideAccess: draft });
}

const getCachedSettings = unstable_cache(() => querySettings(false), ['cms-global-settings'], {
  tags: ['global-settings'],
});

export function getCmsSettings(draft = false): Promise<any> {
  return draft ? querySettings(true) : getCachedSettings();
}

async function queryNavigation(draft = false): Promise<any> {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: 'navigation', draft, overrideAccess: draft });
}

const getCachedNavigation = unstable_cache(() => queryNavigation(false), ['cms-global-navigation'], {
  tags: ['global-navigation'],
});

export function getCmsNavigation(draft = false): Promise<any> {
  return draft ? queryNavigation(true) : getCachedNavigation();
}

async function queryFooter(draft = false): Promise<any> {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: 'footer', draft, overrideAccess: draft });
}

const getCachedFooter = unstable_cache(() => queryFooter(false), ['cms-global-footer'], {
  tags: ['global-footer'],
});

export function getCmsFooter(draft = false): Promise<any> {
  return draft ? queryFooter(true) : getCachedFooter();
}

async function queryPages(): Promise<any[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'pages',
    draft: false,
    sort: 'slug',
    limit: 100,
    pagination: false,
    overrideAccess: false,
  });
  return result.docs;
}

export const getCmsPages = unstable_cache(queryPages, ['cms-pages'], {
  tags: ['collection-pages'],
});
