import config from '@payload-config';
import { getPayload, type Where } from 'payload';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim() || '';
  const collection = searchParams.get('collection')?.trim() || 'newsletter';
  const category = searchParams.get('category')?.trim() || '';

  const payload = await getPayload({ config });

  try {
    if (collection === 'newsletter') {
      const conditions: Where[] = [{ _status: { equals: 'published' } }];
      if (q) conditions.push({ or: [
        { title: { contains: q } }, { excerpt: { contains: q } },
        { 'meta.title': { contains: q } }, { 'meta.description': { contains: q } },
        { 'tags.tag': { contains: q } },
      ] });
      if (category && category !== 'All') conditions.push({ category: { equals: category } });
      const result = await payload.find({
        collection: 'newsletter', where: { and: conditions }, limit: 100,
        depth: 1, sort: 'sortOrder', overrideAccess: false,
      });
      return NextResponse.json({
        docs: result.docs.map((doc) => ({ ...doc, tags: (doc.tags || []).map((tag) => tag.tag) })),
        totalDocs: result.totalDocs,
        source: 'collection',
      });
    }

    const andConditions: Where[] = [];

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

    const where: Where = andConditions.length > 0 ? { and: andConditions } : {};

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

    return NextResponse.json({ docs: [], totalDocs: 0, source: 'payload-search-plugin' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
