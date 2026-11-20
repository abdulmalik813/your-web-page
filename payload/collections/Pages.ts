import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { cmsCollectionCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';
import { slugField, makeSlugHook } from '../fields/slug';
import { linkField } from '../fields/link';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => livePreviewUrl({ data, collectionSlug: 'pages' }),
      breakpoints: livePreviewBreakpoints,
      openByDefault: false,
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    ...cmsCollectionCacheHooks('pages'),
    beforeValidate: [makeSlugHook('title', true)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title', {}, true),
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [
        {
          slug: 'hero',
          interfaceName: 'HeroBlock',
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'textarea', required: true },
            { name: 'highlight', type: 'text' },
            { name: 'lead', type: 'textarea' },
            linkField({ name: 'primaryLink', label: 'Primary link' }),
            linkField({ name: 'secondaryLink', label: 'Secondary link' }),
            {
              name: 'facts',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          slug: 'content',
          interfaceName: 'ContentBlock',
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
            { name: 'content', type: 'richText', editor: lexicalEditor() },
            { name: 'columns', type: 'select', defaultValue: 'one', options: ['one', 'two'] },
          ],
        },
        {
          slug: 'cta',
          interfaceName: 'CtaBlock',
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea' },
            linkField({ name: 'primaryLink', label: 'Primary link' }),
            linkField({ name: 'secondaryLink', label: 'Secondary link' }),
          ],
        },
        {
          slug: 'cardGrid',
          interfaceName: 'CardGridBlock',
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
            { name: 'source', type: 'select', required: true, options: ['services', 'projects', { label: 'Newsletters', value: 'newsletter' }, 'faqs', 'testimonials', 'process', 'custom'] },
            { name: 'limit', type: 'number', defaultValue: 6 },
            { name: 'notice', type: 'text' },
            {
              name: 'cards',
              type: 'array',
              admin: { condition: (_, siblingData) => siblingData?.source === 'custom' },
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                linkField({ name: 'link', label: 'Link', withLabel: false }),
                { name: 'number', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'testimonials',
          interfaceName: 'TestimonialsBlock',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'What clients say' },
            { name: 'heading', type: 'text', defaultValue: 'In their words' },
            { name: 'limit', type: 'number', defaultValue: 12 },
          ],
        },
        {
          slug: 'form',
          interfaceName: 'FormBlock',
          fields: [
            { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
            { name: 'description', type: 'richText', editor: lexicalEditor() },
          ],
        },
        {
          slug: 'legal',
          interfaceName: 'LegalBlock',
          fields: [
            { name: 'sections', type: 'array', required: true, fields: [
              { name: 'heading', type: 'text', required: true },
              { name: 'paragraphs', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true }] },
              { name: 'bullets', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true }] },
            ] },
          ],
        },
      ],
    },
  ],
  versions: { drafts: { autosave: true } },
};

