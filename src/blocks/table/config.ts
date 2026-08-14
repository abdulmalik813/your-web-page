import { Block } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { defaultLexicalValue } from '@/constants/default-lexical'

export const TableBlock = (dbPrefix: string = ''): Block => ({
  slug: 'tableBlock',
  interfaceName: 'TableBlock',
  dbName: `${dbPrefix}table`,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'caption',
              type: 'text',
              label: 'Table Caption',
              admin: {
                description: 'Optional caption displayed above or below the table',
              },
            },
            {
              name: 'showHeader',
              type: 'checkbox',
              label: 'Show Header Row',
              defaultValue: true,
            },
            {
              name: 'headers',
              type: 'array',
              label: 'Table Headers',
              minRows: 1,
              required: true,
              admin: {
                condition: (data) => data.showHeader !== false,
              },
              fields: [
                {
                  name: 'header',
                  type: 'richText',
                  required: true,
                  label: 'Header Cell',
                  editor: defaultLexical({
                    features: {
                      blocks: {
                        blocks: [MediaBlock("tb"), NavigationBlock("tb")],
                        inlineBlocks: [MediaBlock("tbI"), NavigationBlock("tbI")],
                      },
                    },
                  }),
                  defaultValue: defaultLexicalValue,
                },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              label: 'Table Rows',
              minRows: 1,
              required: true,
              fields: [
                {
                  name: 'cells',
                  type: 'array',
                  label: 'Row Cells',
                  minRows: 1,
                  required: true,
                  fields: [
                    {
                      type: 'tabs',
                      tabs: [
                        {
                          label: 'Content',
                          fields: [
                            {
                              name: 'content',
                              type: 'richText',
                              required: true,
                              label: 'Cell Content',
                              editor: defaultLexical({
                                features: {
                                  blocks: {
                                    blocks: [MediaBlock("tb"), NavigationBlock("tb")],
                                    inlineBlocks: [MediaBlock("tbI"), NavigationBlock("tbI")],
                                  },
                                },
                              }),
                              defaultValue: defaultLexicalValue,
                            },
                          ],
                        },
                        {
                          label: 'Styles',
                          fields: [
                            {
                              name: 'cellStyles',
                              type: 'relationship',
                              relationTo: 'styles',
                              hasMany: true,
                              label: 'Cell Styles',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'rowStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Row Styles',
                },
              ],
            },
          ],
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'tableStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Table Styles',
              admin: {
                description: 'Styles for the entire table container',
              },
            },
            {
              name: 'headerStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Header Styles',
              admin: {
                description: 'Styles applied to the table header',
              },
            },
            {
              name: 'bodyStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Body Styles',
              admin: {
                description: 'Styles applied to the table body',
              },
            },
            {
              name: 'captionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Caption Styles',
              admin: {
                description: 'Styles applied to the table caption',
              },
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'TableBlockTableBlock',
  },
})
