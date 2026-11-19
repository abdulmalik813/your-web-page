import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCanonicalUrl, getAllSitemapEntries } from './seo';

test('canonical URLs use the configured application URL', () => {
  process.env.APP_URL = 'https://example.com';
  assert.equal(buildCanonicalUrl('/about'), 'https://example.com/about');
  assert.equal(buildCanonicalUrl('/'), 'https://example.com');
});

test('sitemap entries contain no blog or pricing routes', () => {
  process.env.APP_URL = 'https://example.com';
  const entries = getAllSitemapEntries();
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.equal(entry.url.includes('/blog'), false);
    assert.equal(entry.url.includes('/pricing'), false);
  }
});
