import { defaultLexical } from '@/fields/lexical-field'
import type { Block } from 'payload'

export const FormBlock = (dbPrefix: string = ''): Block => ({
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  dbName: `${dbPrefix}form`,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Configuration',
          fields: [
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
            },
            {
              name: 'enableDescription',
              type: 'checkbox',
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                condition: (_, { enableDescription }) => Boolean(enableDescription),
              },
              editor: defaultLexical(),
            },
          ],
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'cardStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Card Container Styles',
            },
            {
              name: 'titleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Title Styles',
            },
            {
              name: 'descriptionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Description Styles',
              admin: {
                condition: (_, data) => data.enableDescription,
              },
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
})
