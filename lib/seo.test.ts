import test from 'node:test';
import assert from 'node:assert/strict';
import { livePreviewUrl } from './live-preview';
import { buildCanonicalUrl, buildPageMetadata, getAllSitemapEntries, getBaseUrl } from './seo';
import { getServerSideURL } from './get-url';

test('canonical URLs use the configured application URL', () => {
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://example.com';
  assert.equal(buildCanonicalUrl('/about'), 'https://example.com/about');
  assert.equal(buildCanonicalUrl('/'), 'https://example.com');
});


test('getServerSideURL resolves NEXT_PUBLIC_SERVER_URL', () => {
  const prevApp = process.env.NEXT_PUBLIC_SERVER_URL;

  process.env.NEXT_PUBLIC_SERVER_URL = 'https://yourwebpage.ca/';

  assert.equal(getServerSideURL(), 'https://yourwebpage.ca');

  // Restore
  if (prevApp === undefined) {
    delete process.env.NEXT_PUBLIC_SERVER_URL;
  } else {
    process.env.NEXT_PUBLIC_SERVER_URL = prevApp;
  }
});

test('page metadata uses the Settings image as a fallback and prefers a page image', () => {
  const previousServerUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://yourwebpage.ca';

  try {
    const fallbackMetadata = buildPageMetadata({
      title: 'Contact',
      description: 'Contact us',
      path: '/contact',
      fallbackImage: { url: '/api/media/file/default.jpg' },
    });
    assert.ok(JSON.stringify(fallbackMetadata).includes('https://yourwebpage.ca/api/media/file/default.jpg'));

    const pageMetadata = buildPageMetadata({
      title: 'Contact',
      description: 'Contact us',
      path: '/contact',
      image: { url: '/api/media/file/contact.jpg' },
      fallbackImage: { url: '/api/media/file/default.jpg' },
    });
    assert.ok(JSON.stringify(pageMetadata).includes('https://yourwebpage.ca/api/media/file/contact.jpg'));
    assert.equal(JSON.stringify(pageMetadata).includes('default.jpg'), false);
  } finally {
    if (previousServerUrl === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousServerUrl;
  }
});

test('livePreviewUrl stays on the current origin', () => {
  const previewUrl = livePreviewUrl({ collectionSlug: 'pages', data: { slug: 'contact' } });
  assert.ok(previewUrl.startsWith('/api/draft/enable?'));
  assert.ok(previewUrl.includes('path=%2Fcontact'));
});

test('sitemap entries contain no blog or pricing routes', () => {
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://example.com';
  const entries = getAllSitemapEntries();
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.equal(entry.url.includes('/blog'), false);
    assert.equal(entry.url.includes('/pricing'), false);
  }
});
