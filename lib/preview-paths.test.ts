import test from 'node:test';
import assert from 'node:assert/strict';
import { isPreviewPath, toPreviewPath, toPublicPath } from './preview-paths';

test('preview paths stay scoped to the preview route', () => {
  assert.equal(isPreviewPath('/preview'), true);
  assert.equal(isPreviewPath('/preview/'), true);
  assert.equal(isPreviewPath('/preview/about'), true);
  assert.equal(isPreviewPath('/preview/about?tab=seo'), true);
  assert.equal(isPreviewPath('/previewish'), false);
  assert.equal(isPreviewPath('/about'), false);
});

test('public paths strip the preview prefix once', () => {
  assert.equal(toPublicPath('/preview'), '/');
  assert.equal(toPublicPath('/preview/'), '/');
  assert.equal(toPublicPath('/preview/about'), '/about');
  assert.equal(toPublicPath('/preview/about?tab=seo'), '/about');
  assert.equal(toPublicPath('/preview//about'), '/about');
  assert.equal(toPublicPath('/about'), '/about');
  assert.equal(toPublicPath('/previewish'), '/previewish');
});

test('preview paths do not nest /preview', () => {
  assert.equal(toPreviewPath('/'), '/preview');
  assert.equal(toPreviewPath('/about'), '/preview/about');
  assert.equal(toPreviewPath('/preview'), '/preview');
  assert.equal(toPreviewPath('/preview/about'), '/preview/about');
  assert.equal(toPreviewPath('/preview//about'), '/preview/about');
  assert.equal(toPreviewPath('about'), '/preview/about');
});
