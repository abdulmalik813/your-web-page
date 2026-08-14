import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { slugField } from 'payload'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting } from '@/payload-types'


let cachedPostEnabled: boolean | null = null

const checkPostEnabled = async (): Promise<boolean> => {
  try {
    const setting = (await getCachedGlobal('settings', 1, true)) as Setting
    cachedPostEnabled = setting?.enablePost ?? false
    return cachedPostEnabled
  } catch {
    cachedPostEnabled = false
    return false
  }
}

export const Categories: CollectionConfig<'categories'> = {
  slug: 'categories',
  access: {
    create: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return authenticated({ req })
    },
    delete: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return authenticated({ req })
    },
    read: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return true
    },
    update: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return authenticated({ req })
    },
  },
  admin: {
    defaultColumns: ['name', 'slug', 'updatedAt'],
    useAsTitle: 'name',
        hidden: ({ user }) => {
      if (user?.payload) {
        checkPostEnabled()
      }
      return cachedPostEnabled === false
    },
  },
  defaultPopulate: {
    name: true,
    slug: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'color',
      type: 'select',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Secondary',
          value: 'secondary',
        },
        {
          label: 'Destructive',
          value: 'destructive',
        },
        {
          label: 'Outline',
          value: 'outline',
        },
      ],
      defaultValue: 'default',
    },
    slugField(),
  ],
}
