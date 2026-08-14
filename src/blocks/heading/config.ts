import { Block } from 'payload'

export const HeadingBlock = (dbPrefix: string = ''): Block => ({
  slug: 'headingBlock',
  interfaceName: 'HeadingBlock',
  dbName: `${dbPrefix}heading`,
  fields: [
    {
      name: 'headingTag',
      label: 'Heading Tag',
      type: 'select',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'H5', value: 'h5' },
        { label: 'H6', value: 'h6' },
      ],
      defaultValue: 'h2',
      required: true,
    },
    {
      name: 'headingText',
      label: 'Heading Text',
      type: 'text',
      required: true,
    },
    {
      name: 'headingStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
  ],
  graphQL: {
    singularName: 'HeadingBlock',
  },
})
