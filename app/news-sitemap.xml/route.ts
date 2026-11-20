import { getCmsNewsletters, getCmsSettings } from '@/lib/cms';
import { getBaseUrl } from '@/lib/seo';

export const revalidate = 900;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

export async function GET() {
  const base = getBaseUrl();
  const [newsletters, settings] = await Promise.all([getCmsNewsletters(), getCmsSettings()]);
  const publicationName = settings?.brand || 'Your Web Page';
  const cutoff = Date.now() - TWO_DAYS_MS;

  const recent = newsletters
    .map((entry) => ({
      entry,
      published: new Date(`${entry.isoDate}T09:00:00-04:00`),
    }))
    .filter(({ published }) => Number.isFinite(published.getTime()) && published.getTime() >= cutoff)
    .sort((a, b) => b.published.getTime() - a.published.getTime());

  const urls = recent
    .map(
      ({ entry, published }) => `  <url>
    <loc>${escapeXml(`${base}/newsletters/${entry.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${published.toISOString()}</news:publication_date>
      <news:title>${escapeXml(entry.title)}</news:title>
      <news:keywords>${escapeXml(entry.tags.join(', '))}</news:keywords>
    </news:news>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=900',
    },
  });
}
