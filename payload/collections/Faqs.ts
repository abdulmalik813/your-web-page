import type { CollectionConfig } from 'payload';
import { cmsCollectionCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'groupTitle', 'featuredOnHome', 'sortOrder'],
    livePreview: {
      url: () => livePreviewUrl({ data: {}, collectionSlug: 'faqs' }),
      breakpoints: livePreviewBreakpoints,
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: cmsCollectionCacheHooks('faqs'),
  fields: [
    {
      name: 'keyId',
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
      name: 'groupTitle',
      type: 'select',
      required: true,
      options: [
        'Getting started',
        'Working with us from anywhere',
        'Building your site',
        'After launch',
      ],
    },
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featuredOnHome',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  versions: { drafts: { autosave: true } },
};
