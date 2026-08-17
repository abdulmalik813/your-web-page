import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'
import { generateStylesheet, revalidateCache, revalidateDelete } from '@/collections/styles/hooks'

const isFontStyle = ({ data, doc }: any) => {
  const className = data?.className ?? doc?.className
  return className?.startsWith('font-')
}

const canManageStyle = (args: any) => {
  if (!authenticated(args)) return false

  if (isFontStyle(args)) {
    return false
  }

  return true
}

const canUpdateNonFontField = ({ data, doc }: any) => {
  const className = data?.className ?? doc?.className
  return !className?.startsWith('font-')
}

export const Styles: CollectionConfig<'styles'> = {
  slug: 'styles',
  access: {
    create: canManageStyle,
    read: anyone,
    update: canManageStyle,
    delete: canManageStyle,
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
        update: canUpdateNonFontField,
      },
    },
    {
      name: 'tailwind',
      type: 'checkbox',
      label: 'Tailwind',
      defaultValue: true,
      access: {
        update: canUpdateNonFontField,
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
        update: canUpdateNonFontField,
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
        update: canUpdateNonFontField,
      },
    },
  ],
  hooks: {
    beforeChange: [generateStylesheet],
    afterChange: [revalidateCache],
    afterDelete: [revalidateDelete],
  },
}