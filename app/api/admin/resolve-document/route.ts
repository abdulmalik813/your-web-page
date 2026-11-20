import config from '@payload-config';
import { getPayload } from 'payload';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawPath = request.nextUrl.searchParams.get('path') || '/';
  const cleanPath = rawPath.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '');
  const segments = cleanPath ? cleanPath.split('/').filter(Boolean) : [];

  let targetCollection = 'pages';
  let targetSlug = 'home';

  if (segments.length === 0) {
    targetCollection = 'pages';
    targetSlug = 'home';
  } else if (segments.length === 2) {
    if (segments[0] === 'services') {
      targetCollection = 'services';
      targetSlug = segments[1];
    } else if (segments[0] === 'our-work') {
      targetCollection = 'projects';
      targetSlug = segments[1];
    } else if (segments[0] === 'newsletters') {
      targetCollection = 'newsletter';
      targetSlug = segments[1];
    } else {
      targetCollection = 'pages';
      targetSlug = segments.join('/');
    }
  } else if (segments.length === 1) {
    targetCollection = 'pages';
    targetSlug = segments[0];
  } else {
    targetCollection = 'pages';
    targetSlug = segments.join('/');
  }

  try {
    // Match the catch-all renderer, which gives CMS pages precedence over detail routes.
    if (targetCollection !== 'pages') {
      const page = await payload.find({
        collection: 'pages',
        where: { slug: { equals: cleanPath } },
        limit: 1,
        draft: true,
        overrideAccess: true,
        pagination: false,
      });
      if (page.docs.length > 0) {
        const doc = page.docs[0];
        return NextResponse.json({
          collection: 'pages',
          id: String(doc.id),
          title: String(doc.title || cleanPath),
          editUrl: `/admin/collections/pages/${doc.id}`,
        });
      }
    }

    const result = await payload.find({
      collection: targetCollection as any,
      where: { slug: { equals: targetSlug } },
      limit: 1,
      draft: true,
      overrideAccess: true,
      pagination: false,
    });

    if (result.docs.length > 0) {
      const doc = result.docs[0] as Record<string, any>;
      return NextResponse.json({
        collection: targetCollection,
        id: String(doc.id),
        title: String(doc.title || doc.name || targetSlug),
        editUrl: `/admin/collections/${targetCollection}/${doc.id}`,
      });
    }

    return NextResponse.json({
      collection: null,
      id: null,
      title: null,
      editUrl: null,
    });
  } catch (error) {
    return NextResponse.json({
      collection: null,
      id: null,
      title: null,
      editUrl: null,
      error: error instanceof Error ? error.message : 'Failed to resolve document',
    });
  }
}
