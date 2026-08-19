import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig, APIError } from 'payload'
import { generateStylesheet, revalidateCache, revalidateDelete } from '@/collections/styles/hooks'

const isFontStyle = ({ data, doc }: any) => {
  const className = data?.className ?? doc?.className
  return className?.startsWith('font-')
}

const getFontStyleIds = async ({ req }: any) => {
  const fontStyles = await req.payload.find({
    collection: 'styles',
    where: {
      className: {
        contains: 'font-',
      },
    },
    limit: 1000,
    req,
    overrideAccess: true,
  })

  return fontStyles.docs
    .filter((style: any) => style.className?.startsWith('font-'))
    .map((style: any) => style.id)
}

const canCreateStyle = (args: any) => {
  if (!authenticated(args)) return false

  if (isFontStyle(args)) {
    return false
  }

  return true
}

const canUpdateStyle = async (args: any) => {
  if (!authenticated(args)) return false

  const fontStyleIds = await getFontStyleIds(args)

  if (fontStyleIds.length === 0) {
    return true
  }

  return {
    id: {
      not_in: fontStyleIds,
    },
  }
}

const canDeleteStyle = (args: any) => {
  return authenticated(args)
}

const canUpdateNonFontField = ({ data, doc }: any) => {
  const className = data?.className ?? doc?.className
  return !className?.startsWith('font-')
}

const preventDeletingFontStyle = async ({ id, req }: any) => {
  if (req.context?.allowFontStyleDelete === true) {
    return
  }

  const style = await req.payload.findByID({
    collection: 'styles',
    id,
    req,
    overrideAccess: true,
  })

  if (style?.className?.startsWith('font-')) {
    throw new APIError(
      'Font styles are managed from Settings and cannot be deleted from the Styles collection.',
      400,
    )
  }
}

export const Styles: CollectionConfig<'styles'> = {
  slug: 'styles',
  access: {
    create: canCreateStyle,
    read: anyone,
    update: canUpdateStyle,
    delete: canDeleteStyle,
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
      type: 'code',
      label: 'Stylesheet',
      admin: {
        description: 'CSS stylesheet (if tailwind, the content will be overridden)',
        language: 'css',
      },
      access: {
        update: canUpdateNonFontField,
      },
    },
  ],
  hooks: {
    beforeDelete: [preventDeletingFontStyle],
    beforeChange: [generateStylesheet],
    afterChange: [revalidateCache],
    afterDelete: [revalidateDelete],
  },
}
