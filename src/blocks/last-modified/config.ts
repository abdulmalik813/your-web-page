import { Block } from 'payload'

export const LastModifiedBlock = (dbPrefix: string = ''): Block => ({
  slug: 'lastModifiedBlock',
  interfaceName: 'LastModifiedBlock',
  dbName: `${dbPrefix}last_modified`,
  fields: [
    {
      name: 'cardStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
    {
      name: 'cardContentStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
  ],
  graphQL: {
    singularName: 'LastModifiedBlock',
  },
})
