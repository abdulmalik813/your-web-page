import { getCmsNewsletters, getCmsSettings } from '@/lib/cms';
import { getBaseUrl } from '@/lib/seo';

// Prerendered at build time; revalidated hourly or when newsletters change.
export const dynamic = 'force-static';
export const revalidate = 3600;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toRfc822 = (isoDate: string) => {
  const date = new Date(`${isoDate}T09:00:00-04:00`);
  return Number.isFinite(date.getTime()) ? date.toUTCString() : new Date().toUTCString();
};

export async function GET() {
  const base = getBaseUrl();
  const [newsletters, settings] = await Promise.all([getCmsNewsletters(), getCmsSettings()]);
  const brand = settings?.brand || 'Your Web Page';
  const description =
    settings?.meta?.description || 'Practical reading on websites, online stores and custom software.';

  const items = newsletters
    .map(
      (entry) => `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(`${base}/newsletters/${entry.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${base}/newsletters/${entry.slug}`)}</guid>
      <pubDate>${toRfc822(entry.isoDate)}</pubDate>
      <description>${escapeXml(entry.excerpt)}</description>
      <category>${escapeXml(entry.category)}</category>
${entry.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`,
    )
    .join('\n');

  const lastBuild = newsletters[0]?.isoDate ? toRfc822(newsletters[0].isoDate) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${brand} newsletters`)}</title>
    <link>${escapeXml(`${base}/newsletters`)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-ca</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(`${base}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
