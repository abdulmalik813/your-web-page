import type { Payload } from 'payload';

type SeedableCollection =
  | 'form-submissions'
  | 'forms'
  | 'pages'
  | 'services'
  | 'projects'
  | 'newsletter'
  | 'faqs'
  | 'testimonials';

const SEEDED_COLLECTIONS: SeedableCollection[] = [
  'form-submissions',
  'pages',
  'services',
  'projects',
  'newsletter',
  'faqs',
  'testimonials',
  'forms',
];

export async function wipeSeedCollections(payload: Payload): Promise<void> {
  for (const collection of SEEDED_COLLECTIONS) {
    const existing = await payload.find({
      collection,
      limit: 1000,
      pagination: false,
      depth: 0,
      overrideAccess: true,
    });
    for (const doc of existing.docs as { id: string | number }[]) {
      await payload.delete({ collection, id: doc.id, overrideAccess: true });
    }
  }
}

export async function wipeSearchIndex(payload: Payload): Promise<void> {
  const results = await payload.find({
    collection: 'search',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
  });
  for (const doc of results.docs) {
    await payload.delete({ collection: 'search', id: doc.id, overrideAccess: true });
  }
}
