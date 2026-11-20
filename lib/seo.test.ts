import test from 'node:test';
import assert from 'node:assert/strict';
import { livePreviewUrl } from './live-preview';
import { buildCanonicalUrl, getAllSitemapEntries, getBaseUrl } from './seo';

test('canonical URLs use the configured application URL', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
  assert.equal(buildCanonicalUrl('/about'), 'https://example.com/about');
  assert.equal(buildCanonicalUrl('/'), 'https://example.com');
});

test('local preview URLs replace the wildcard bind address with localhost', () => {
  const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = 'http://0.0.0.0:3000';

  try {
    assert.equal(getBaseUrl(), 'http://localhost:3000');
    const previewPath = livePreviewUrl({ collectionSlug: 'pages', data: { slug: 'contact' } });
    assert.ok(previewPath.startsWith('/api/draft/enable?'));
    const previewUrl = new URL(previewPath, getBaseUrl());
    assert.equal(previewUrl.origin, 'http://localhost:3000');
    assert.equal(previewUrl.searchParams.get('path'), '/contact');
  } finally {
    if (previousAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousAppUrl;
  }
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
