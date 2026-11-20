import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './client';
import { toService } from './mappers';
import type { Service } from './types';

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
  revalidate: 300,
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
    revalidate: 300,
  })();
}
