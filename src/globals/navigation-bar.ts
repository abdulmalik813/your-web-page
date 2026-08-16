import { defaultLexical } from '@/fields/lexical-field'
import { navigation } from '@/fields/navigation'
import { revalidateNavBar } from '@/hooks/revalidate-globals'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { GlobalConfig } from 'payload'

export const NavigationBar: GlobalConfig = {
  slug: 'navigationBar',
  dbName: 'navBar',
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
      name: 'stickyBar',
      label: 'Enable Sticky Bar',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navigation',
              type: 'array',
              label: 'Navigation Links',
              fields: [navigation()],
            },
            {
              name: 'cta',
              type: 'array',
              label: 'CTA Links',
              maxRows: 2,
              fields: [navigation()],
            },
          ],
        },
        {
          label: 'Banner',
          fields: [
            {
              name: 'banner',
              type: 'group',
              label: 'Banner',
              fields: [
                {
                  name: 'enableBanner',
                  type: 'checkbox',
                  label: 'Enable Banner',
                  defaultValue: false,
                },
                {
                  type: 'tabs',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enableBanner === true,
                  },
                  tabs: [
                    {
                      label: 'Content',
                      fields: [
                        {
                          name: 'content',
                          type: 'richText',
                          editor: defaultLexical(),
                        },
                      ],
                    },
                    {
                      label: 'Styles',
                      fields: [
                        {
                          name: 'bannerStyles',
                          type: 'relationship',
                          relationTo: 'styles',
                          hasMany: true,
                        },
                        {
                          name: 'contentStyles',
                          type: 'relationship',
                          relationTo: 'styles',
                          hasMany: true,
                        },
                      ],
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
            },
            {
              name: 'useTitleWithLogo',
              type: 'checkbox',
            },
            {
              name: 'titleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                condition: (_, data) => data?.useTitleWithLogo === true,
              },
            },
            {
              name: 'hideWhenIdle',
              type: 'checkbox',
            },
            {
              name: 'idleTimeout',
              type: 'number',
              defaultValue: 3000,
              admin: {
                condition: (_, data) => data?.hideWhenIdle === true,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateNavBar],
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
