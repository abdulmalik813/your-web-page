import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { revalidateCollection } from '@/hooks/revalidate-collections'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'question',
  },
  labels: {
    singular: 'Frequently asked Question',
    plural: 'Frequently asked Questions',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateCollection]
  }
}
