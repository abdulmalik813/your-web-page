import type { Field, GroupField } from 'payload'
import deepMerge from '@/lib/deep-merge'
import { icon } from '@/fields/icon'
import { navLocation } from '@/fields/nav-location'

type NavType = (options?: { overrides?: Partial<GroupField> }) => Field

const navFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Link Configuration',
    admin: {
      initCollapsed: false,
    },
    fields: [
      ...navLocation(),
      {
        name: 'newTab',
        type: 'checkbox',
        label: 'Open in new tab',
      },
    ],
  },
]

export const navigation: NavType = ({ overrides = {} } = {}) =>
  deepMerge(
    {
      name: 'nav',
      type: 'group',
      label: 'Navigation',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text to display',
          admin: {
            condition: (_, __, data) => {
              return data?.blockData?.text === undefined
            },
          },
        },
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Link',
              fields: [
                {
                  name: 'appearance',
                  type: 'select',
                  defaultValue: 'link',
                  label: 'Display As',
                  options: [
                    { label: 'Text Link', value: 'link' },
                    { label: 'Button', value: 'button' },
                    { label: 'Dropdown Menu', value: 'dropdown' },
                  ],
                },
                {
                  name: 'link',
                  type: 'group',
                  label: false,
                  admin: {
                    condition: (_, siblingData) => siblingData?.appearance !== 'dropdown',
                  },
                  fields: navFields,
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Dropdown Items',
                  fields: [
                    {
                      type: 'tabs',
                      tabs: [
                        {
                          label: 'Link',
                          fields: [
                            {
                              name: 'label',
                              type: 'text',
                              label: 'Label',
                              required: true,
                            },
                            ...navFields,
                          ],
                        },
                        {
                          label: 'Icon',
                          fields: icon(),
                        },
                      ],
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) => siblingData?.appearance === 'dropdown',
                  },
                },
              ],
            },
            {
              label: 'Styling',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Button Settings',
                  admin: {
                    condition: (_, siblingData) => siblingData?.appearance !== 'link',
                    initCollapsed: false,
                  },
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
                        {
                          name: 'listStyle',
                          type: 'relationship',
                          relationTo: 'styles',
                          hasMany: true,
                          label: 'List Style',
                          admin: {
                            condition: (_, siblingData) => siblingData?.appearance === 'dropdown',
                          },
                        },
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
    } as GroupField,
    overrides,
  )
