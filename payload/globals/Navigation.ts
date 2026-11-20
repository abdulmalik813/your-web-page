import type { GlobalConfig } from 'payload';
import { cmsGlobalCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';
import { linkField } from '../fields/link';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: cmsGlobalCacheHooks('navigation'),
  admin: { livePreview: { url: () => livePreviewUrl({ data: {}, globalSlug: 'navigation' }), breakpoints: livePreviewBreakpoints } },
  versions: { drafts: { autosave: true } },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        linkField({ name: 'link', label: 'Link' }),
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          labels: { singular: 'Dropdown item', plural: 'Dropdown items' },
          admin: { description: 'Optional links shown in the right side of the dropdown.' },
          fields: [linkField({ name: 'link', label: 'Link' })],
        },
        {
          name: 'dropdownEyebrow',
          type: 'text',
          label: 'Dropdown eyebrow',
          admin: { description: 'Text shown in the left panel when this item has dropdown items.' },
        },
        { name: 'dropdownHeading', type: 'textarea', label: 'Dropdown heading' },
        { name: 'dropdownCtaLabel', type: 'text', label: 'Dropdown view-all label' },
      ],
    },
  ],
};
