import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './client';
import { toNewsletter } from './mappers';
import type { NewsletterEntry } from './types';

async function queryNewsletters(draft = false): Promise<NewsletterEntry[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'newsletter',
    draft,
    depth: 2,
    where: draft ? undefined : { _status: { equals: 'published' } },
    sort: 'sortOrder',
    limit: 100,
    overrideAccess: draft,
  });
  return result.docs.map(toNewsletter);
}

const getCachedNewsletters = unstable_cache(queryNewsletters, ['cms-newsletter'], {
  tags: ['collection-newsletter'],
  revalidate: 300,
});

export function getCmsNewsletters(draft = false): Promise<NewsletterEntry[]> {
  return draft ? queryNewsletters(true) : getCachedNewsletters();
}

async function queryNewsletterBySlug(slug: string, draft = false): Promise<NewsletterEntry | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'newsletter',
    draft,
    depth: 2,
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    overrideAccess: draft,
  });
  return result.docs[0] ? toNewsletter(result.docs[0]) : undefined;
}

export function getCmsNewsletterBySlug(slug: string, draft = false): Promise<NewsletterEntry | undefined> {
  if (draft) return queryNewsletterBySlug(slug, true);
  return unstable_cache(() => queryNewsletterBySlug(slug), ['cms-newsletter', slug], {
    tags: ['collection-newsletter'],
    revalidate: 300,
  })();
}
