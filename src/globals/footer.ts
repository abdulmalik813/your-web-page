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
              editor: defaultLexical()
            },
            {
              name: 'columns',
              type: 'array',
              label: 'Footer Columns',
              maxRows: 3,
              fields: [
                {
                  name: 'groups',
                  type: 'array',
                  label: 'Link Groups',
                  fields: [
                    {
                      name: 'groupLabel',
                      type: 'text',
                      label: 'Group Label',
                    },
                    {
                      name: 'groupStyles',
                      type: 'relationship',
                      relationTo: 'styles',
                      hasMany: true
                    },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Links',
                      maxRows: 6,
                      fields: [navigation()],
                    },
                  ],
                },
              ],
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
              admin: {
                description: 'Styles for the logo',
              },
            },
            {
              name: 'useLabelWithLogo',
              type: 'checkbox',
            },
            {
              name: 'labelStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                condition: (_, data) => data?.useLabelWithLogo === true,
              },
            },
            {
              name: 'tagLineStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                description: 'Styles for the tagline text',
              },
            },
            {
              name: 'groupLabelStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                description: 'Styles for column group labels',
              },
            },
            {
              name: 'linkStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                description: 'Styles for footer links',
              },
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