import type { Field } from 'payload';
import type { BeforeValidateHook } from 'payload';

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

/**
 * A `beforeValidate` collection hook that auto-fills `slug` from `sourceField`
 * when the document is new (no existing slug) or when the slug is explicitly empty.
 *
 * Usage: add to `hooks.beforeValidate` on the collection.
 */
export function makeSlugHook(sourceField = 'title'): BeforeValidateHook {
  return ({ data, originalDoc }) => {
    // If the slug is already set and not being cleared, leave it alone
    const incomingSlug = data?.slug;
    if (incomingSlug && incomingSlug.trim() !== '') {
      return { ...data, slug: toSlug(incomingSlug) };
    }

    // Auto-generate from source field (new doc or slug was cleared)
    const source = data?.[sourceField] ?? originalDoc?.[sourceField];
    if (source && typeof source === 'string') {
      return { ...data, slug: toSlug(source) };
    }

    return data;
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
export function slugField(watchField = 'title', overrides: Partial<Field> = {}): Field {
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
          },
        },
      },
    },
    ...overrides,
  };
}
