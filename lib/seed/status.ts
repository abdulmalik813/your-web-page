import type { Payload } from 'payload';
import { FAQ_GROUPS } from '@/data/faqs';
import { NEWSLETTERS } from '@/data/newsletters';
import { PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { TESTIMONIALS } from '@/data/testimonials';
import { FORM_COUNT } from './forms';
import { PAGE_COUNT } from './pages';
import type { SeedStatus } from './types';

export async function getPayloadSeedStatus(payload: Payload): Promise<SeedStatus> {
  const [services, projects, newsletter, faqs, testimonials, pages, forms] =
    await Promise.all([
      payload.count({ collection: 'services', overrideAccess: true }),
      payload.count({ collection: 'projects', overrideAccess: true }),
      payload.count({ collection: 'newsletter', overrideAccess: true }),
      payload.count({ collection: 'faqs', overrideAccess: true }),
      payload.count({ collection: 'testimonials', overrideAccess: true }),
      payload.count({ collection: 'pages', overrideAccess: true }),
      payload.count({ collection: 'forms', overrideAccess: true }),
    ]);

  return {
    counts: {
      services: services.totalDocs,
      projects: projects.totalDocs,
      newsletter: newsletter.totalDocs,
      faqs: faqs.totalDocs,
      testimonials: testimonials.totalDocs,
      pages: pages.totalDocs,
      forms: forms.totalDocs,
    },
    totals: {
      services: SERVICES.length,
      projects: PROJECTS.length,
      newsletter: NEWSLETTERS.length,
      faqs: FAQ_GROUPS.reduce((sum, group) => sum + group.items.length, 0),
      testimonials: TESTIMONIALS.length,
      pages: PAGE_COUNT,
      forms: FORM_COUNT,
    },
  };
}
