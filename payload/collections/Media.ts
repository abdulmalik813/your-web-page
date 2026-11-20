import type { CollectionConfig } from 'payload';
import { cmsMediaCacheHooks } from '../../lib/cms-cache';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: cmsMediaCacheHooks(),
  upload: {
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*']
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'creditText',
      type: 'text',
    },
    {
      name: 'creator',
      type: 'text',
    },
    {
      name: 'license',
      type: 'text',
    },
    {
      name: 'copyrightNotice',
      type: 'text',
    },
    {
      name: 'acquireLicensePage',
      type: 'text',
    },
  ],
};
