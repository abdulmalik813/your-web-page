import { GroupField } from 'payload'
import { media } from '@/fields/media'
import { card } from '@/fields/card'

export const hero: GroupField = {
  type: 'group',
  name: 'hero',
  fields: [
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'with-image',
      label: 'Hero Layout',
      options: [
        { label: 'Full Screen Hero', value: 'fullscreen' },
        { label: 'Hero with Image', value: 'with-image' },
        { label: 'Simple Hero (Text Only)', value: 'text-only' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroTitle',
              type: 'textarea',
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout === 'text-only'
                },
              },
            },
            {
              name: 'heroDescription',
              type: 'textarea',
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout === 'text-only'
                },
              },
            },
            {
              type: 'group',
              name: 'card',
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout !== 'text-only'
                },
              },
              fields: card(),
            },
            {
              name: 'backgroundStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout === 'with-image'
                },
              },
            },
          ],
        },
        {
          label: 'Media',
          admin: {
            condition: (data, siblingData) => {
              const layout = siblingData?.layout || data?.hero?.layout
              return layout !== 'text-only'
            },
          },
          fields: media,
        },
        {
          label: 'Styling',
          admin: {
            condition: (data, siblingData) => {
              const layout = siblingData?.layout || data?.hero?.layout
              return layout === 'text-only' || layout === 'fullscreen'
            },
          },
          fields: [
            {
              name: 'fullscreenStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout === 'fullscreen'
                },
              },
            },
            {
              type: 'group',
              admin: {
                condition: (data, siblingData) => {
                  const layout = siblingData?.layout || data?.hero?.layout
                  return layout === 'text-only'
                },
              },
              fields: [
                {
                  name: 'containerStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Hero Container Styles',
                  admin: {
                    description: 'Styles applied to the entire hero section',
                  },
                },
                {
                  name: 'heroTitleStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Title Styles',
                },
                {
                  name: 'heroDescriptionStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Description Styles',
                },
              ],
            },
          ],
        },
        {
          label: 'Carousel',
          admin: {
            condition: (data, siblingData) => {
              const layout = siblingData?.layout || data?.hero?.layout
              return layout === 'fullscreen'
            },
          },
          fields: [
            {
              name: 'enableCarousel',
              type: 'checkbox',
              label: 'Enable Carousel',
              defaultValue: false,
            },
            {
              name: 'slides',
              type: 'array',
              label: 'Carousel Slides',
              admin: {
                condition: (data, siblingData) => {
                  return siblingData?.enableCarousel
                },
              },
              fields: [
                {
                  type: 'group',
                  name: 'card',
                  fields: card(),
                },
                ...media,
              ],
            },
          ],
        },
      ],
    },
  ],
}
