import test from 'node:test';
import assert from 'node:assert/strict';
import { calcFillerCount, filterProjects, filterResources } from './filters';

const projects = [
  { id: 1, slug: 'one', title: 'One', type: 'Website', tags: [], initials: 'ONE', pattern: 'p1', role: '', summary: '', challenge: '', approach: '', outcomes: [] },
  { id: 2, slug: 'two', title: 'Two', type: 'Software', tags: [], initials: 'TWO', pattern: 'p2', role: '', summary: '', challenge: '', approach: '', outcomes: [] },
  { id: 3, slug: 'three', title: 'Three', type: 'SaaS', tags: [], initials: 'THR', pattern: 'p3', role: '', summary: '', challenge: '', approach: '', outcomes: [] },
] as any;

const resources = [
  { slug: 'guide', title: 'Guide', excerpt: 'Planning in Charlottetown', category: 'Guide', tags: ['Planning'], publishDate: '', isoDate: '', readTime: 5, meta: { title: 'SEO-only resource title', description: 'SEO-only resource description' }, sections: [{ heading: 'Local launch', paragraphs: ['Search engine optimization for Island businesses'], bullets: ['Mobile-first checklist'] }] },
  { slug: 'check', title: 'Checklist', excerpt: 'Launch list', category: 'Checklist', tags: [], publishDate: '', isoDate: '', readTime: 3, sections: [] },
] as any;

test('filters CMS documents by type and category', () => {
  assert.equal(filterProjects(projects, 'All').length, 3);
  assert.equal(filterProjects(projects, 'Website').length, 1);
  assert.equal(filterResources(resources, 'All', '').length, 2);
  assert.equal(filterResources(resources, 'Guide', 'Charlottetown').length, 1);
  assert.equal(filterResources(resources, 'All', 'not-found').length, 0);
  assert.equal(filterResources(resources, 'All', 'Search engine optimization').length, 1);
  assert.equal(filterResources(resources, 'All', 'SEO-only resource title').length, 1);
  assert.equal(filterResources(resources, 'All', 'SEO-only resource description').length, 1);
});

test('calcFillerCount fills incomplete grid rows accurately', () => {
  assert.equal(calcFillerCount(6, 3), 0);
  assert.equal(calcFillerCount(2, 3), 1);
  assert.equal(calcFillerCount(1, 3), 2);
  assert.equal(calcFillerCount(5, 2), 1);
  assert.equal(calcFillerCount(0, 3), 0);
});
