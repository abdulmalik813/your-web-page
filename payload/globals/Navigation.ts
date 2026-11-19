import type { GlobalConfig } from 'payload';
import { cmsGlobalCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';

const linkField = {
  name: 'items',
  type: 'array' as const,
  fields: [
    { name: 'label', type: 'text' as const, required: true },
    { name: 'href', type: 'text' as const, required: true },
  ],
};

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: cmsGlobalCacheHooks('navigation'),
  admin: { livePreview: { url: () => livePreviewUrl({ data: {}, globalSlug: 'navigation' }), breakpoints: livePreviewBreakpoints } },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'homeLabel', type: 'text', defaultValue: 'Home' },
    { name: 'contactLabel', type: 'text', defaultValue: 'Contact' },
    { name: 'contactHref', type: 'text', defaultValue: '/contact' },
    { name: 'projectLabel', type: 'text', defaultValue: 'Start a project' },
    { name: 'projectHref', type: 'text', defaultValue: '/start-a-project' },
    linkField,
  ],
};
