import { GroupField } from 'payload'
import { media } from '@/fields/media'
import { card } from '@/fields/card'
import { navigation } from '@/fields/navigation'
import { icon } from '@/fields/icon'

export const hero: GroupField = {
  type: 'group',
  name: 'hero',
  fields: [
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'home-page',
      label: 'Hero Layout',
      options: [
        { label: 'Home Page Hero', value: 'home-page' },
        { label: 'Hero with Image', value: 'with-image' },
        { label: 'Simple Hero (Text Only)', value: 'text-only' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Headline & Intro',
          admin: {
            condition: (data, siblingData) => {
              const layout = siblingData?.layout || data?.hero?.layout
              return layout === 'home-page' || layout === 'text-only'
            },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Main Headline',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Subtitle / Description',
            },
            {
              name: 'actions',
              type: 'array',
              label: 'Call to Action Buttons',
              maxRows: 4,
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout === 'home-page'
                },
              },
              fields: [navigation()],
            },
            {
              name: 'titleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Headline Styles',
            },
            {
              name: 'descriptionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Description Styles',
            },
            {
              name: 'actionsStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Actions Wrapper Styles',
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout === 'home-page'
                },
              },
            },
          ],
        },
        {
          label: 'Services Card',
          admin: {
            condition: (data, siblingData) => {
              const layout = siblingData?.layout || data?.hero?.layout
              return layout === 'home-page'
            },
          },
          fields: [
            {
              name: 'homePageCard',
              type: 'group',
              label: 'Right-Side Services Card',
              fields: [
                {
                  name: 'badgeText',
                  type: 'text',
                  label: 'Badge / Tagline',
                },
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Card Heading',
                },
                ...icon(),
                {
                  name: 'items',
                  type: 'array',
                  label: 'Service Feature Items',
                  minRows: 1,
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Feature Title',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                      label: 'Feature Description',
                    },
                    ...icon(),
                    {
                      name: 'itemStyles',
                      type: 'relationship',
                      relationTo: 'styles',
                      hasMany: true,
                      label: 'Feature Item Row Styles',
                    },
                  ],
                },
                {
                  name: 'cardStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Card Container Styles',
                },
                {
                  name: 'badgeStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Badge Styles',
                },
                {
                  name: 'headingStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Heading Styles',
                },
              ],
            },
          ],
        },
        {
          label: 'Card Content',
          admin: {
            condition: (data, siblingData) => {
              const layout = siblingData?.layout || data?.hero?.layout
              return layout === 'with-image'
            },
          },
          fields: [
            {
              type: 'group',
              name: 'card',
              fields: card(),
            },
            {
              name: 'backgroundStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Media',
          admin: {
            condition: (data, siblingData) => {
              const layout = siblingData?.layout || data?.hero?.layout
              return layout === 'with-image'
            },
          },
          fields: media,
        },
        {
          label: 'Layout Styles',
          fields: [
            {
              name: 'sectionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Overall Hero Section Styles',
            },
          ],
        },
      ],
    },
  ],
}
