import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * POST /api/revalidate-all
 *
 * Busts every Next.js cache tag used by the CMS:
 *  - All collection tags (collection-{slug})
 *  - All global tags (global-{slug})
 *  - Sitemap + redirects
 *  - Layout paths
 *
 * Requires an authenticated Payload session (cookie-based).
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    const { user } = await payload.auth({ headers: request.headers });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collectionSlugs = payload.config.collections.map((c) => c.slug);
    for (const slug of collectionSlugs) {
      revalidateTag(`collection-${slug}`, { expire: 0 });
    }

    const globalSlugs = payload.config.globals.map((g) => g.slug);
    for (const slug of globalSlugs) {
      revalidateTag(`global-${slug}`, { expire: 0 });
    }

    revalidateTag('site-sitemap', { expire: 0 });
    revalidateTag('redirects', { expire: 0 });

    revalidatePath('/', 'layout');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({
      ok: true,
      revalidated: true,
      message: 'All cache tags busted successfully.',
      collections: collectionSlugs,
      globals: globalSlugs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[revalidate-all]', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Revalidation failed.' },
      { status: 500 },
    );
  }
}
