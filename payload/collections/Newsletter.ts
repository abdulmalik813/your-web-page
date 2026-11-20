import type { CollectionConfig } from 'payload';
import { cmsCollectionCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';
import { makeSlugHook, slugField } from '../fields/slug';
import { newsletterEditor } from './newsletter/editor';
import { stampPublishDate } from './newsletter/hooks';

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  dbName: 'newsletter',
  labels: { singular: 'Newsletter', plural: 'Newsletters' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishDate', 'readTime', 'sortOrder'],
    livePreview: {
      url: ({ data }) => livePreviewUrl({ data, collectionSlug: 'newsletter' }),
      breakpoints: livePreviewBreakpoints,
    },
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    ...cmsCollectionCacheHooks('newsletter'),
    beforeValidate: [makeSlugHook('title')],
    beforeChange: [stampPublishDate],
  },
  fields: [
    {
      name: 'sendNewsletter',
      type: 'ui',
      admin: {
        components: {
          Field: '@/payload/components/admin/SendNewsletter#SendNewsletter',
        },
      },
    },
    slugField('title'),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image shown on newsletter cards and its detail page.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['Guide', 'Checklist', 'Tutorial', 'Case Study', 'Notes'],
    },
    {
      name: 'tags',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'publishDate',
      type: 'text',
      required: true,
    },
    {
      name: 'isoDate',
      type: 'text',
      required: true,
    },
    {
      name: 'readTime',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: newsletterEditor(),
    },
  ],
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: { timeFormat: 'h:mm aa', timeIntervals: 15 },
    },
  },
};
