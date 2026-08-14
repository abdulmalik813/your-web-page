import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const FontFiles: CollectionConfig = {
  slug: 'font-files',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: 'System',
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
      index: true,
    },
    {
      name: 'fontId',
      type: 'text',
      required: true,
      index: true,
    },
  ],
  upload: {
    mimeTypes: ['font/woff2', 'font/woff', 'application/font-woff2', 'application/font-woff'],
  },
}
