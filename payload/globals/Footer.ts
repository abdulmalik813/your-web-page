import type { GlobalConfig } from 'payload';
import { cmsGlobalCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: cmsGlobalCacheHooks('footer'),
  admin: { livePreview: { url: () => livePreviewUrl({ data: {}, globalSlug: 'footer' }), breakpoints: livePreviewBreakpoints } },
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
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
};
