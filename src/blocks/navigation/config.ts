import { navigation } from '@/fields/navigation'
import { Block } from 'payload'

export const NavigationBlock = (dbPrefix: string = ''): Block => ({
  slug: 'navigationBlock',
  interfaceName: 'navigationBlock',
  dbName: `${dbPrefix}nav`,
  fields: [navigation()],
  graphQL: {
    singularName: 'NavigationBlock',
  },
})
