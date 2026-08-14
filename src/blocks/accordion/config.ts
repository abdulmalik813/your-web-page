import { Block } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { defaultLexicalValue } from '@/constants/default-lexical'

export const AccordionBlock = (dbPrefix: string = ''): Block => ({
  slug: 'accordionBlock',
  interfaceName: 'AccordionBlock',
  dbName: `${dbPrefix}accordion`,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Items',
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
                          name: 'trigger',
                          type: 'text',
                          required: true,
                          label: 'Trigger',
                        },
                        {
                          name: 'content',
                          type: 'richText',
                          required: true,
                          editor: defaultLexical({
                            features: {
                              blocks: {
                                blocks: [MediaBlock("acn"), NavigationBlock("acn")],
                                inlineBlocks: [MediaBlock("acnI"), NavigationBlock("acnI")],
                              },
                            },
                          }),
                          defaultValue: defaultLexicalValue,
                          label: 'Content',
                        },
                      ],
                    },
                    {
                      label: 'Styles',
                      fields: [
                        {
                          name: 'triggerStyles',
                          type: 'relationship',
                          relationTo: 'styles',
                          hasMany: true,
                          label: 'Trigger Styles',
                        },
                        {
                          name: 'contentStyles',
                          type: 'relationship',
                          relationTo: 'styles',
                          hasMany: true,
                          label: 'Content Styles',
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
              name: 'accordionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Accordion Styles',
              admin: {
                description: 'Styles for the entire accordion container',
              },
            },
            {
              name: 'accordionItemStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Accordion Item Styles',
              admin: {
                description: 'Styles applied to all accordion items',
              },
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'AccordionBlockAccordionBlock',
  },
})