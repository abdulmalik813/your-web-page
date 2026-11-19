import type { GlobalConfig } from 'payload';
import { cmsGlobalCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Settings',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: cmsGlobalCacheHooks('settings'),
  admin: { livePreview: { url: () => livePreviewUrl({ data: {}, globalSlug: 'settings' }), breakpoints: livePreviewBreakpoints } },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'brand', type: 'text', required: true },
    { name: 'shortMark', type: 'text', required: true },
    { name: 'domain', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'phoneHref', type: 'text', required: true },
    { name: 'schemaTelephone', type: 'text', required: true },
    {
      name: 'location',
      type: 'group',
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'province', type: 'text', required: true },
        { name: 'provinceCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'countryCode', type: 'text', required: true },
        { name: 'summary', type: 'textarea', required: true },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      fields: [
        { name: 'entity', type: 'text', required: true },
        { name: 'tradeNameStatement', type: 'textarea', required: true },
        { name: 'copyrightHolder', type: 'text', required: true },
      ],
    },
    { name: 'areaServed', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'x', type: 'text' },
      ],
    },
  ],
};
