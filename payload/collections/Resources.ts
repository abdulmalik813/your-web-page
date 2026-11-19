import type { CollectionConfig } from 'payload';
import { cmsCollectionCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishDate', 'readTime', 'sortOrder'],
    livePreview: {
      url: ({ data }) => livePreviewUrl({ data, collectionSlug: 'resources' }),
      breakpoints: livePreviewBreakpoints,
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: cmsCollectionCacheHooks('resources'),
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
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
        description: 'Optional image shown on resource cards and its detail page.',
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
      name: 'sections',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'paragraphs',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          name: 'bullets',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  versions: { drafts: true },
};
