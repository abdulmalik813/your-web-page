import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'
import { generateStylesheet, revalidateCache, revalidateDelete } from '@/collections/styles/hooks'

export const Styles: CollectionConfig<'styles'> = {
  slug: 'styles',
  access: {
    create: (args) => {
      if (!authenticated(args)) return false
      if (args.data?.className?.startsWith('font-')) {
        return args.req.context?.fromSettings === true
      }
      return true
    },
    read: anyone,
    update: (args) => {
      if (!authenticated(args)) return false
      if (args.data?.className?.startsWith('font-')) {
        return args.req.context?.fromSettings === true
      }
      return true
    },
    delete: (args) => {
      if (!authenticated(args)) return false
      if (args.data?.className?.startsWith('font-')) {
        return args.req.context?.fromSettings === true
      }
      return true
    },
  },
  admin: {
    useAsTitle: 'alias',
    hideAPIURL: true,
    defaultColumns: ['alias', 'className', 'tailwind'],
  },
  fields: [
    {
      name: 'alias',
      type: 'text',
      required: true,
      unique: true,
      label: 'Alias',
      access: {
        update: ({ data }) => !data?.className?.startsWith('font-'),
      },
    },
    {
      name: 'tailwind',
      type: 'checkbox',
      label: 'Tailwind',
      defaultValue: true,
      access: {
        update: ({ data }) => !data?.className?.startsWith('font-'),
      },
    },
    {
      name: 'className',
      type: 'text',
      label: 'Class name',
      required: true,
      admin: {
        description: 'Changing this will require Site revalidation.',
      },
      access: {
        update: ({ data }) => !data?.className?.startsWith('font-'),
      },
    },
    {
      name: 'stylesheet',
      type: 'textarea',
      label: 'Stylesheet',
      admin: {
        description: 'CSS stylesheet (if tailwind, the content will be overridden)',
      },
      access: {
        update: ({ data }) => !data?.className?.startsWith('font-'),
      },
    },
  ],
  hooks: {
    beforeChange: [generateStylesheet],
    afterChange: [revalidateCache],
    afterDelete: [revalidateDelete],
  },
}
