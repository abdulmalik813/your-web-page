import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './client';

async function querySettings(draft = false): Promise<any> {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: 'settings', draft, depth: 1, overrideAccess: draft });
}

const getCachedSettings = unstable_cache(() => querySettings(false), ['cms-global-settings'], {
  tags: ['global-settings'],
  revalidate: 300,
});

export function getCmsSettings(draft = false): Promise<any> {
  return draft ? querySettings(true) : getCachedSettings();
}

async function queryNavigation(draft = false): Promise<any> {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: 'navigation', draft, overrideAccess: draft });
}

const getCachedNavigation = unstable_cache(() => queryNavigation(false), ['cms-global-navigation'], {
  tags: ['global-navigation'],
  revalidate: 300,
});

export function getCmsNavigation(draft = false): Promise<any> {
  return draft ? queryNavigation(true) : getCachedNavigation();
}

async function queryFooter(draft = false): Promise<any> {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: 'footer', draft, overrideAccess: draft });
}

const getCachedFooter = unstable_cache(() => queryFooter(false), ['cms-global-footer'], {
  tags: ['global-footer'],
  revalidate: 300,
});

export function getCmsFooter(draft = false): Promise<any> {
  return draft ? queryFooter(true) : getCachedFooter();
}
