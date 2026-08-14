import { Block } from 'payload'

export const ImageCarouselBlock = (dbPrefix: string = ''): Block => ({
  slug: 'imageCarouselBlock',
  interfaceName: 'imageCarouselBlock',
  dbName: `${dbPrefix}imageCarousel`,
  fields: [
    {
      name: 'medias',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
  ],
  graphQL: {
    singularName: 'ImageCarouselBlock',
  },
})
