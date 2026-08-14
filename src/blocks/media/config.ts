import { media } from '@/fields/media'
import { Block } from 'payload'

export const MediaBlock = (dbPrefix: string = ''): Block => ({
  slug: 'mediaBlock',
  interfaceName: 'mediaBlock',
  dbName: `${dbPrefix}media`,
  fields: media,
  graphQL: {
    singularName: 'MediaBlock',
  },
})
