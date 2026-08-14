import { Field } from 'payload'

export const media: Field[] = [
  {
    name: 'media',
    type: 'relationship',
    relationTo: 'media',
  },
  {
    name: 'wrapperStyles',
    type: 'relationship',
    relationTo: 'styles',
    hasMany: true,
  },
  {
    name: 'contentStyles',
    type: 'relationship',
    relationTo: 'styles',
    hasMany: true,
  },
]
