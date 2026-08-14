import { Block } from 'payload'
import { card } from '@/fields/card'

export const CardBlock = (dbPrefix: string = ''): Block => ({
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  dbName: `${dbPrefix}card`,
  fields: card(),
  graphQL: {
    singularName: 'CardBlock',
  },
})
