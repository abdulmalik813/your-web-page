import type { Field } from 'payload'
import { icon } from '@/fields/icon'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { TabBlock } from '@/blocks/tab/config'
import { CardBlock } from '@/blocks/card/config'
import { AccordionBlock } from '@/blocks/accordion/config'
import { DividerBlock } from '@/blocks/divider/config'
import { FormBlock } from '@/blocks/form/config'
import { TableBlock } from '@/blocks/table/config'
import { IconBlock } from '@/blocks/icon/config'
import { defaultLexicalValue } from '@/constants/default-lexical'

export const formOverrides: Field[] = [
  {
    name: 'confirmationMessage',
    type: 'group',
    label: 'Confirmation Message',
    fields: [
      {
        name: 'contentStyles',
        type: 'relationship',
        relationTo: 'styles',
        hasMany: true,
        label: 'Content Styles',
      },
      {
        name: 'content',
        type: 'richText',
        label: 'Content',
        editor: defaultLexical({
          features: {
            blocks: {
              blocks: [
                MediaBlock('frm'),
                NavigationBlock('frm'),
                TabBlock('frm'),
                CardBlock('frm'),
                AccordionBlock('frm'),
                DividerBlock('frm'),
                FormBlock('frm'),
                TableBlock('frm'),
              ],
              inlineBlocks: [NavigationBlock('frmI'), IconBlock('frmI')],
            },
          },
        }),
        defaultValue: defaultLexicalValue,
      },
    ],
  },
  {
    name: 'submitButton',
    type: 'group',
    label: 'Submit Button',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Text to display',
        defaultValue: 'Submit',
      },
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Styling',
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'buttonType',
                    type: 'select',
                    label: 'Button Style',
                    defaultValue: 'default',
                    admin: {
                      width: '50%',
                    },
                    options: [
                      { label: 'Primary', value: 'default' },
                      { label: 'Destructive', value: 'destructive' },
                      { label: 'Outline', value: 'outline' },
                      { label: 'Secondary', value: 'secondary' },
                      { label: 'Ghost', value: 'ghost' },
                      { label: 'Link Style', value: 'link' },
                    ],
                  },
                  {
                    name: 'buttonSize',
                    type: 'select',
                    label: 'Button Size',
                    defaultValue: 'default',
                    admin: {
                      width: '50%',
                    },
                    options: [
                      { label: 'Small', value: 'sm' },
                      { label: 'Medium', value: 'default' },
                      { label: 'Large', value: 'lg' },
                      { label: 'Extra Large', value: 'xl' },
                      { label: '2X Large', value: '2xl' },
                      { label: '3X Large', value: '3xl' },
                      { label: '4X Large', value: '4xl' },
                      { label: 'Icon', value: 'icon' },
                      { label: 'Small Icon', value: 'icon-sm' },
                      { label: 'Large Icon', value: 'icon-lg' },
                    ],
                  },
                ],
              },
              {
                name: 'styles',
                type: 'relationship',
                relationTo: 'styles',
                hasMany: true,
                label: 'Appearance Styling',
              },
            ],
          },
          {
            label: 'Icon',
            fields: icon(),
          },
        ],
      },
    ],
  },
]
