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


test('getServerSideURL resolves NEXT_PUBLIC_APP_URL', () => {
  const prevApp = process.env.NEXT_PUBLIC_APP_URL;

  process.env.NEXT_PUBLIC_APP_URL = 'https://yourwebpage.ca/';

  assert.equal(getServerSideURL(), 'https://yourwebpage.ca');
  assert.equal(getClientSideURL(), 'https://yourwebpage.ca');

  // Restore
  if (prevApp === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = prevApp;
  }
});

test('livePreviewUrl returns a full URL using the browser origin', () => {
  // In a Node test environment there is no DOM, so getClientSideURL() falls
  // back to getServerSideURL(). We set NEXT_PUBLIC_APP_URL to control the value.
  const prev = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = 'https://yourwebpage.ca';

  const previewUrl = livePreviewUrl({ collectionSlug: 'pages', data: { slug: 'contact' } });
  assert.ok(previewUrl.startsWith('https://yourwebpage.ca/api/draft/enable?'));
  assert.ok(previewUrl.includes('path=%2Fcontact'));

  if (prev === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
  else process.env.NEXT_PUBLIC_APP_URL = prev;
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
