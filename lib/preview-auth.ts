import { cache } from 'react';
import config from '@payload-config';
import { headers } from 'next/headers';
import { getPayload } from 'payload';

/**
 * Per-request preview session lookup. Preview queries bypass collection access
 * for drafts, so both metadata and rendering must be gated by this check.
 */
export const getPreviewUser = cache(async () => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  return user;
});
