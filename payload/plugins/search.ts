import { searchPlugin } from '@payloadcms/plugin-search';

export function createSearchPlugin() {
  return searchPlugin({
    collections: ['pages', 'services', 'projects', 'newsletter', 'faqs'],
    defaultPriorities: {
      pages: 20,
      services: 15,
      projects: 12,
      newsletter: 10,
      faqs: 8,
    },
    beforeSync: ({ originalDoc, searchDoc }) => ({
      ...searchDoc,
      category: originalDoc?.category,
      excerpt:
        originalDoc?.excerpt || originalDoc?.metaDescription || originalDoc?.summary,
      slug: originalDoc?.slug,
    }),
    searchOverrides: {
      fields: ({ defaultFields }) => [
        ...defaultFields,
        { name: 'category', type: 'text' },
        { name: 'excerpt', type: 'textarea' },
        { name: 'slug', type: 'text' },
      ],
    },
  });
}
