import { revalidatePath, revalidateTag } from 'next/cache';
import type { CollectionConfig, GlobalConfig } from 'payload';

export function revalidateCmsCollection(slug: string): void {
  revalidateTag(`collection-${slug}`, 'max');
  revalidateTag('site-sitemap', 'max');
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
}

export function revalidateCmsGlobal(slug: string): void {
  revalidateTag(`global-${slug}`, 'max');
  revalidatePath('/', 'layout');
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
