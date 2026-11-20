import { ValidationError, type CollectionBeforeValidateHook, type TextField } from 'payload';

type SingleTextField = Extract<TextField, { hasMany?: false }>;

/** Convert any string to a URL-safe slug */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Normalize each segment separately so nested page paths retain their slashes. */
export function toPageSlug(value: string): string {
  return value.trim().replace(/^\/+|\/+$/g, '').split('/').map(toSlug).join('/');
}

export function validatePageSlug(slug: string): true | string {
  if (!slug || slug.split('/').some((segment) => !segment)) {
    return 'Enter a page slug with a non-empty name between each slash, such as test/more.';
  }
  const segments = slug.split('/');
  if (['unsubscribe', 'admin', 'api', 'robotstxt', 'sitemapxml', '_next'].includes(segments[0])) {
    return `/${slug} is reserved for an existing site route. Choose another page slug.`;
  }
  if (segments.length === 2 && ['services', 'our-work', 'newsletters'].includes(segments[0])) {
    return `/${slug} is reserved for existing site content. Choose another page slug.`;
  }
  return true;
}

/**
 * A `beforeValidate` collection hook that auto-fills `slug` from `sourceField`
 * when the document is new (no existing slug) or when the slug is explicitly empty.
 *
 * Usage: add to `hooks.beforeValidate` on the collection.
 */
export function makeSlugHook(sourceField = 'title', allowNested = false): CollectionBeforeValidateHook {
  return ({ data, originalDoc, req }) => {
    const incomingSlug = data?.slug;
    const source = data?.[sourceField] ?? originalDoc?.[sourceField];
    const raw = typeof incomingSlug === 'string' && incomingSlug.trim()
      ? incomingSlug
      : incomingSlug === undefined && originalDoc?.slug
        ? originalDoc.slug
        : source;

    if (typeof raw !== 'string') return data;
    const slug = allowNested ? toPageSlug(raw) : toSlug(raw);
    if (allowNested) {
      const result = validatePageSlug(slug);
      if (result !== true) {
        throw new ValidationError({ collection: 'pages', errors: [{ path: 'slug', message: result }], req });
      }
    }
    return { ...data, slug };
  };
}

/**
 * Returns a Payload `Field` config for slug with:
 * - Custom admin UI component (lock/unlock auto-generate from `watchField`)
 * - `beforeValidate` auto-generation server-side as a fallback
 *
 * @param watchField - The field name to watch/generate from (default: 'title')
 * @param overrides  - Any Field overrides to merge in
 */
export function slugField(watchField = 'title', overrides: Partial<SingleTextField> = {}, allowNested = false): SingleTextField {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      components: {
        Field: {
          path: '@/payload/components/SlugField#SlugField',
          clientProps: {
            watchField,
            allowNested,
          },
        },
      },
    },
    ...overrides,
  };
}
