import type { Block } from 'payload'

export const MapBlock = (dbPrefix: string = ''): Block => ({
  slug: 'mapBlock',
  interfaceName: 'MapBlock',
  dbName: `${dbPrefix}map`,
  fields: [
    {
      name: 'mapUrl',
      type: 'text',
      label: 'Map URL',
      required: true,
    },
    {
      name: 'text',
      type: 'text',
      label: 'Overlay Text',
    },
  ],
  graphQL: {
    singularName: 'MapBlock',
  },
})
