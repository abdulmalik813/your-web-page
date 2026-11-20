import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveImageUrl } from './media';

test('keeps Payload media paths relative to the current origin', () => {
  const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

  try {
    assert.equal(
      resolveImageUrl({ url: '/api/media/file/image.jpeg?prefix=media' }, 'medium'),
      '/api/media/file/image.jpeg?prefix=media',
    );
    assert.equal(
      resolveImageUrl({ url: 'http://localhost:3000/api/media/file/image.jpeg?prefix=media' }, 'medium'),
      '/api/media/file/image.jpeg?prefix=media',
    );
  } finally {
    if (previousAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousAppUrl;
  }
});

test('preserves absolute media URLs for external storage', () => {
  assert.equal(
    resolveImageUrl({ url: 'https://cdn.example.com/image.jpeg' }, 'medium'),
    'https://cdn.example.com/image.jpeg',
  );
});
