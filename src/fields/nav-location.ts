import { Field } from 'payload'

export const navLocation = (): Field[] => {
  return [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'reference',
      label: 'Link Type',
      options: [
        { label: 'Internal Page', value: 'reference' },
        { label: 'Post Listing Page', value: 'postListingPage' },
        { label: 'External URL', value: 'custom' },
      ],
      validate: async (value: any, { req }: any) => {
        if (value === 'postListingPage') {
          const setting = await req.payload.findGlobal({
            slug: 'settings',
          })
          if (!setting?.enablePost) {
            return 'Posts must be enabled in setting to use Post Listing Page'
          }
        }
        return true
      },
    },
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, data) => data?.type === 'reference',
      },
      relationTo: ['pages', 'posts'],
      filterOptions: async ({ req, relationTo }) => {
        const setting = await req.payload.findGlobal({
          slug: 'settings',
        })

        if (!setting?.enablePost && relationTo === 'posts') {
          return {
            id: {
              exists: false,
            },
          }
        }
        return true
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, data) => data?.type === 'custom',
      },
      defaultValue: 'https://',
      label: 'URL',
      required: true,
    }
  ]
}