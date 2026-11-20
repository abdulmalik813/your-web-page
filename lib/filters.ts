import type { Project, ProjectType, NewsletterCategory, NewsletterEntry } from './cms';

export type ProjectFilter = 'All' | ProjectType;
export type NewsletterFilter = 'All' | NewsletterCategory;

export function filterProjects(projects: Project[], type: ProjectFilter): Project[] {
  if (type === 'All') return projects;
  return projects.filter((project) => project.type === type);
}

export function filterNewsletters(newsletter: NewsletterEntry[], category: NewsletterFilter, query: string): NewsletterEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  return newsletter.filter((entry) => {
    if (category !== 'All' && entry.category !== category) return false;
    if (!normalizedQuery) return true;
    const searchable = [
      entry.title,
      entry.meta?.title || '',
      entry.meta?.description || '',
      entry.category,
      entry.excerpt,
      ...entry.tags,
      ...(entry.sections ?? []).flatMap((section) => [
        section.heading || '',
        ...(section.paragraphs || []),
        ...(section.bullets || []),
      ]),
    ].join(' ').toLowerCase();
    return searchable.includes(normalizedQuery);
  });
}
