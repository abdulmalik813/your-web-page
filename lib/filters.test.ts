import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProjects, filterNewsletters } from './filters';

const projects = [
  { id: 1, slug: 'one', title: 'One', type: 'Website', tags: [], role: '', summary: '', challenge: '', approach: '', outcomes: [] },
  { id: 2, slug: 'two', title: 'Two', type: 'Software', tags: [], role: '', summary: '', challenge: '', approach: '', outcomes: [] },
  { id: 3, slug: 'three', title: 'Three', type: 'SaaS', tags: [], role: '', summary: '', challenge: '', approach: '', outcomes: [] },
] as any;

const newsletter = [
  { slug: 'guide', title: 'Guide', excerpt: 'Planning in Charlottetown', category: 'Guide', tags: ['Planning'], publishDate: '', isoDate: '', readTime: 5, meta: { title: 'SEO-only newsletter title', description: 'SEO-only newsletter description' }, sections: [{ heading: 'Local launch', paragraphs: ['Search engine optimization for Island businesses'], bullets: ['Mobile-first checklist'] }] },
  { slug: 'check', title: 'Checklist', excerpt: 'Launch list', category: 'Checklist', tags: [], publishDate: '', isoDate: '', readTime: 3, sections: [] },
] as any;

test('filters CMS documents by type and category', () => {
  assert.equal(filterProjects(projects, 'All').length, 3);
  assert.equal(filterProjects(projects, 'Website').length, 1);
  assert.equal(filterNewsletters(newsletter, 'All', '').length, 2);
  assert.equal(filterNewsletters(newsletter, 'Guide', 'Charlottetown').length, 1);
  assert.equal(filterNewsletters(newsletter, 'All', 'not-found').length, 0);
  assert.equal(filterNewsletters(newsletter, 'All', 'Search engine optimization').length, 1);
  assert.equal(filterNewsletters(newsletter, 'All', 'SEO-only newsletter title').length, 1);
  assert.equal(filterNewsletters(newsletter, 'All', 'SEO-only newsletter description').length, 1);
});
