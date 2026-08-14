import { Block } from 'payload'
import { icon } from '@/fields/icon'

export const IconBlock = (dbPrefix: string = ''): Block => ({
  slug: 'iconBlock',
  interfaceName: 'IconBlock',
  dbName: `${dbPrefix}icon`,
  fields: [...icon()],
  graphQL: {
    singularName: 'IconBlock',
  },
})
