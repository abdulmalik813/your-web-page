import { revalidatePath, revalidateTag } from 'next/cache';
import type { CollectionConfig, GlobalConfig } from 'payload';

const EXPECTED_OUTSIDE_REQUEST = [
  "can't be called during render",
  'static generation store missing',
  'revalidate-in-use-cache',
];

/**
 * Payload jobs (scheduled publish, cron tasks) run outside a Next.js request,
 * where revalidateTag/revalidatePath are not allowed. The CMS caches all carry
 * a 5-minute TTL, so the site still picks the change up shortly after.
 */
function safelyRevalidate(run: () => void): void {
  try {
    run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (EXPECTED_OUTSIDE_REQUEST.some((fragment) => message.includes(fragment))) {
      console.warn('[cms-cache] revalidation skipped outside a request; TTL will refresh the cache');
      return;
    }
    console.error('[cms-cache] revalidation failed:', message);
  }
}

export function revalidateCmsCollection(slug: string): void {
  safelyRevalidate(() => revalidateTag(`collection-${slug}`, 'max'));
  safelyRevalidate(() => revalidateTag('site-sitemap', 'max'));
  safelyRevalidate(() => revalidatePath('/', 'layout'));
  safelyRevalidate(() => revalidatePath('/sitemap.xml'));
  safelyRevalidate(() => revalidatePath('/feed.xml'));
  safelyRevalidate(() => revalidatePath('/news-sitemap.xml'));
}

export function revalidateCmsGlobal(slug: string): void {
  safelyRevalidate(() => revalidateTag(`global-${slug}`, 'max'));
  safelyRevalidate(() => revalidatePath('/', 'layout'));
}

export function cmsCollectionCacheHooks(
  slug: string,
): NonNullable<CollectionConfig['hooks']> {
  return {
    afterChange: [
      ({ doc }) => {
        revalidateCmsCollection(slug);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateCmsCollection(slug);
        return doc;
      },
    ],
  };
}

export function cmsMediaCacheHooks(): NonNullable<CollectionConfig['hooks']> {
  return {
    afterChange: [
      ({ doc }) => {
        for (const slug of ['media', 'services', 'projects', 'newsletter']) {
          revalidateCmsCollection(slug);
        }
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        for (const slug of ['media', 'services', 'projects', 'newsletter']) {
          revalidateCmsCollection(slug);
        }
        return doc;
      },
    ],
  };
}

export function cmsGlobalCacheHooks(
  slug: string,
): NonNullable<GlobalConfig['hooks']> {
  return {
    afterChange: [
      ({ doc }) => {
        revalidateCmsGlobal(slug);
        return doc;
      },
    ],
  };
}
