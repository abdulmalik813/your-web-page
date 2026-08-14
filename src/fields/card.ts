import { Field } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { navigation } from '@/fields/navigation'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { TabBlock } from '@/blocks/tab/config'
import { AccordionBlock } from '@/blocks/accordion/config'
import { defaultLexicalValue } from '@/constants/default-lexical'
import { FormBlock } from '@/blocks/form/config'
import { IconBlock } from '@/blocks/icon/config'

export const card = (): Field[] => {
  return [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Configuration',
          fields: [
            {
              name: 'enableTitle',
              type: 'checkbox',
              label: 'Enable Title',
              defaultValue: true,
            },
            {
              name: 'enableAction',
              type: 'checkbox',
              label: 'Enable Action',
              defaultValue: false,
            },
            {
              name: 'enableDescription',
              type: 'checkbox',
              label: 'Enable Description',
              defaultValue: false,
            },
            {
              name: 'enableContent',
              type: 'checkbox',
              label: 'Enable Content',
              defaultValue: false,
            },
            {
              name: 'enableFooter',
              type: 'checkbox',
              label: 'Enable Footer',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Card',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Card Title',
              admin: {
                condition: (_, data) => data.enableTitle,
              },
            },
            {
              type: 'collapsible',
              label: 'Card Action',
              admin: {
                condition: (_, data) => data.enableAction,
              },
              fields: [
                {
                  name: 'actionPlacement',
                  type: 'select',
                  options: [
                    { label: 'Header', value: 'header' },
                    { label: 'Footer', value: 'footer' },
                  ],
                  defaultValue: 'header',
                },
                {
                  name: 'action',
                  type: 'array',
                  required: true,
                  fields: [navigation()],
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Card Description',
              admin: {
                condition: (_, data) => data.enableDescription,
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: defaultLexical({
                features: {
                  blocks: {
                    blocks: [MediaBlock("cd"), NavigationBlock("cd"), TabBlock("cd"), AccordionBlock("cd"), FormBlock("cd")],
                    inlineBlocks: [MediaBlock("cdI"), NavigationBlock("cdI"), IconBlock("cdI")],
                  },
                },
              }),
              defaultValue: defaultLexicalValue,
              label: 'Card Content',
              admin: {
                condition: (_, data) => data.enableContent,
              },
            },
            {
              name: 'footer',
              type: 'text',
              required: true,
              label: 'Card Footer',
              admin: {
                condition: (_, data) => data.enableFooter,
              },
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
              admin: {
                condition: (_, data) => data.enableTitle,
              },
            },
            {
              name: 'actionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Action Styles',
              admin: {
                condition: (_, data) => data.enableAction,
              },
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
            {
              name: 'cardContentStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Content Styles',
              admin: {
                condition: (_, data) => data.enableContent,
              },
            },
            {
              name: 'footerStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Footer Styles',
              admin: {
                condition: (_, data) => data.enableFooter,
              },
            },
          ],
        },
      ],
    },
  ]
}
