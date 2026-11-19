import type { CollectionConfig } from 'payload';
import { cmsCollectionCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'roleAndCompany', 'location', 'approved'],
    livePreview: {
      url: () => livePreviewUrl({ data: {}, collectionSlug: 'testimonials' }),
      breakpoints: livePreviewBreakpoints,
    },
    description:
      'Only client quotes with "approved" checked appear on the public website. Never add invented quotes.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: cmsCollectionCacheHooks('testimonials'),
  fields: [
    {
      name: 'keyId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'roleAndCompany',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Must be checked with written client permission before displaying publicly.',
      },
    },
  ],
  versions: { drafts: { autosave: true } },
};
