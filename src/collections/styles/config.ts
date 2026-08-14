import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'
import { generateStylesheet, revalidateCache, revalidateDelete } from '@/collections/styles/hooks'

export const Styles: CollectionConfig<'styles'> = {
  slug: 'styles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'alias',
  },
  fields: [
    {
      name: 'alias',
      type: 'text',
      required: true,
      unique: true,
      label: 'Alias',
    },
    {
      name: 'tailwind',
      type: 'checkbox',
      label: 'Tailwind',
      defaultValue: true,
    },
    {
      name: 'className',
      type: 'text',
      label: 'Class name',
      required: true,
      admin: {
        description: 'Changing this will require Site revalidation.',
      },
    },
    {
      name: 'stylesheet',
      type: 'textarea',
      label: 'Stylesheet',
      admin: {
        description: 'CSS stylesheet (if tailwind, the content will be overridden)',
      },
    },
  ],
  hooks: {
    beforeChange: [generateStylesheet],
    afterChange: [revalidateCache],
    afterDelete: [revalidateDelete],
  },
}
