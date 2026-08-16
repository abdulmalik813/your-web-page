import { defaultLexical } from '@/fields/lexical-field'
import { navigation } from '@/fields/navigation'
import { revalidateFooter } from '@/hooks/revalidate-globals'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: () => generatePreviewPath(),
    },
    preview: () => generatePreviewPath(),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'tagLine',
              type: 'richText',
              label: 'Tag Line',
              editor: defaultLexical(),
            },
            {
              name: 'links',
              type: 'array',
              label: 'Footer Links',
              fields: [navigation()],
            },
          ],
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'logoStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
            {
              name: 'tagLineStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
            {
              name: 'linkStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
  },
}
