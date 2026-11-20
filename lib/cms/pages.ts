import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './client';

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
    revalidate: 300,
  })();
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
  revalidate: 300,
});
