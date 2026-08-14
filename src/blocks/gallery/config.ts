import { navigation } from '@/fields/navigation'
import { Block } from 'payload'

export const GalleryBlock = (dbPrefix: string = ''): Block => ({
  slug: 'galleryBlock',
  interfaceName: 'GalleryBlock',
  dbName: `${dbPrefix}gallery`,
  fields: [
    {
      name: 'format',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'Focus',
          value: 'focus',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        condition: (_, data) => data.format == 'carousel',
      },
    },
    {
      name: 'titleStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
      admin: {
        condition: (_, data) => data.format == 'carousel',
      },
    },
    navigation({
      overrides: {
        admin: {
          condition: (_, siblingData) => siblingData.format === 'carousel',
        },
      },
    }),
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'GalleryBlock',
  },
})
