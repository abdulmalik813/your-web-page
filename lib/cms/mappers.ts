import { type MediaAsset, type NewsletterCategory, type NewsletterEntry, type Project, type ProjectType, type Service } from './types';

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

export function toService(value: unknown): Service {
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

export function toProject(value: unknown): Project {
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

export function toNewsletter(value: unknown): NewsletterEntry {
  const doc = value as Record<string, unknown>;
  return {
    slug: String(doc.slug),
    title: String(doc.title),
    image: mediaAsset(doc.image),
    excerpt: String(doc.excerpt),
    category: String(doc.category) as NewsletterCategory,
    tags: tagRows(doc.tags),
    publishDate: String(doc.publishDate),
    isoDate: String(doc.isoDate),
    readTime: Number(doc.readTime),
    content: doc.content,
    meta: metaFields(doc.meta),
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
  };
}
