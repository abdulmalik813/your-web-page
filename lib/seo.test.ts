import test from 'node:test';
import assert from 'node:assert/strict';
import { livePreviewUrl } from './live-preview';
import { buildCanonicalUrl, getAllSitemapEntries, getBaseUrl } from './seo';
import { getServerSideURL, getClientSideURL } from './get-url';

test('canonical URLs use the configured application URL', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
  assert.equal(buildCanonicalUrl('/about'), 'https://example.com/about');
  assert.equal(buildCanonicalUrl('/'), 'https://example.com');
});

test('getServerSideURL and getClientSideURL resolve the application URL properly', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://yourwebpage.ca/';
  assert.equal(getServerSideURL(), 'https://yourwebpage.ca');
  assert.equal(getClientSideURL(), 'https://yourwebpage.ca');
});

test('livePreviewUrl returns a relative URL for safe origin resolution', () => {
  const previewPath = livePreviewUrl({ collectionSlug: 'pages', data: { slug: 'contact' } });
  assert.ok(previewPath.startsWith('/api/draft/enable?'));
  assert.ok(previewPath.includes('path=%2Fcontact'));
});

test('sitemap entries contain no blog or pricing routes', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
  const entries = getAllSitemapEntries();
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.equal(entry.url.includes('/blog'), false);
    assert.equal(entry.url.includes('/pricing'), false);
  }
});
