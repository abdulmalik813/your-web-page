import type { GlobalConfig } from 'payload';
import { cmsGlobalCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';
import { linkField } from '../fields/link';

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: cmsGlobalCacheHooks('footer'),
  admin: { livePreview: { url: () => livePreviewUrl({ data: {}, globalSlug: 'footer' }), breakpoints: livePreviewBreakpoints } },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'tagline', type: 'textarea', required: true },
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [linkField({ name: 'link', label: 'Link' })],
        },
      ],
    },
  ],
};
