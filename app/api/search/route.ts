import config from '@payload-config';
import { getPayload } from 'payload';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim() || '';
  const collection = searchParams.get('collection')?.trim() || 'resources';
  const category = searchParams.get('category')?.trim() || '';

  const payload = await getPayload({ config });

  try {
    const andConditions: any[] = [];

    if (collection) {
      andConditions.push({
        'doc.relationTo': {
          equals: collection,
        },
      });
    }

    if (q) {
      andConditions.push({
        or: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
        ],
      });
    }

    if (category && category !== 'All') {
      andConditions.push({
        category: {
          equals: category,
        },
      });
    }

    const where = andConditions.length > 0 ? { and: andConditions } : {};

    // 1. Query the Payload Search Plugin collection
    const searchResults = await payload.find({
      collection: 'search',
      where,
      limit: 100,
      depth: 1,
      overrideAccess: true,
    });

    if (searchResults.docs.length > 0) {
      const docs = searchResults.docs
        .map((item: any) => {
          const populated = typeof item.doc?.value === 'object' ? item.doc.value : null;
          if (populated) return populated;
          return {
            id: item.id,
            title: item.title,
            slug: item.slug || item.doc?.value || '',
            category: item.category || 'Guide',
            excerpt: item.excerpt || '',
            tags: [],
            publishDate: '',
            readTime: 5,
            sections: [],
          };
        })
        .filter(Boolean);

      return NextResponse.json({
        docs,
        totalDocs: searchResults.totalDocs,
        source: 'payload-search-plugin',
      });
    }

    // 2. Fallback to direct collection query if search index has not indexed docs yet
    if (collection === 'resources') {
      const fallbackAnd: any[] = [];
      if (q) {
        fallbackAnd.push({
          or: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { 'sections.paragraphs': { contains: q } },
          ],
        });
      }
      if (category && category !== 'All') {
        fallbackAnd.push({ category: { equals: category } });
      }
      const fallbackWhere = fallbackAnd.length > 0 ? { and: fallbackAnd } : {};

      const fallback = await payload.find({
        collection: 'resources',
        where: fallbackWhere,
        limit: 100,
        overrideAccess: true,
      });

      return NextResponse.json({
        docs: fallback.docs,
        totalDocs: fallback.totalDocs,
        source: 'collection-fallback',
      });
    }

    return NextResponse.json({ docs: [], totalDocs: 0, source: 'payload-search-plugin' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
