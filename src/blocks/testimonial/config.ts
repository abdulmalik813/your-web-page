import { navigation } from '@/fields/navigation'
import { Block } from 'payload'

export const TestimonialBlock = (dbPrefix: string = ''): Block => ({
  slug: 'testimonialBlock',
  interfaceName: 'testimonialBlock',
  dbName: `${dbPrefix}testimonial`,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'carousel',
      options: [
        {
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        condition: (_, data) => data.type == 'carousel',
      },
    },
    {
      name: 'titleStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
      admin: {
        condition: (_, data) => data.type == 'carousel',
      },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      required: true,
      hasMany: true,
      label: 'Testimonials',
    },
    navigation({
      overrides: {
        admin: {
          condition: (_, data) => data.type == 'carousel',
        },
      },
    }),
  ],
  graphQL: {
    singularName: 'TestimonialBlock',
  },
})
