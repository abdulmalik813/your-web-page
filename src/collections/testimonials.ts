import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { revalidateCollection } from '@/hooks/revalidate-collections'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'individual',
      options: [
        {
          label: 'Individual',
          value: 'individual',
        },
        {
          label: 'Company',
          value: 'company',
        },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'company',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'company',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
    },
  ],
  hooks: {
    afterChange: [revalidateCollection],
  },
}
