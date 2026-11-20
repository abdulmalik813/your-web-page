import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './client';
import type { Testimonial } from './types';

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
  revalidate: 300,
});

export function getCmsApprovedTestimonials(draft = false): Promise<Testimonial[]> {
  return draft ? queryApprovedTestimonials(true) : getCachedApprovedTestimonials();
}
