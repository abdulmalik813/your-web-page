import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './client';
import { toProject } from './mappers';
import type { Project } from './types';

async function queryProjects(draft = false): Promise<Project[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'projects',
    draft,
    depth: 1,
    sort: 'sortOrder',
    limit: 100,
    overrideAccess: draft,
  });
  return result.docs.map(toProject);
}

const getCachedProjects = unstable_cache(queryProjects, ['cms-projects'], {
  tags: ['collection-projects'],
  revalidate: 300,
});

export function getCmsProjects(draft = false): Promise<Project[]> {
  return draft ? queryProjects(true) : getCachedProjects();
}

async function queryProjectBySlug(slug: string, draft = false): Promise<Project | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'projects',
    draft,
    depth: 1,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: draft,
  });
  return result.docs[0] ? toProject(result.docs[0]) : undefined;
}

export function getCmsProjectBySlug(slug: string, draft = false): Promise<Project | undefined> {
  if (draft) return queryProjectBySlug(slug, true);
  return unstable_cache(() => queryProjectBySlug(slug), ['cms-project', slug], {
    tags: ['collection-projects'],
    revalidate: 300,
  })();
}
