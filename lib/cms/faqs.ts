import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './client';
import type { FaqGroup, FaqItem } from './types';

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
  revalidate: 300,
});

export function getCmsFaqGroups(draft = false): Promise<FaqGroup[]> {
  return draft ? queryFaqGroups(true) : getCachedFaqGroups();
}

export async function getCmsFeaturedFaqs(draft = false): Promise<FaqItem[]> {
  return (await getCmsFaqGroups(draft))
    .flatMap((group) => group.items)
    .filter((item) => item.featuredOnHome);
}
