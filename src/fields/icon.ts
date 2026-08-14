import { Field } from 'payload'

export const icon = (): Field[] => {
  return [
    {
      name: 'icon',
      type: 'relationship',
      relationTo: 'icons',
      label: 'Icon',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'axis',
          type: 'select',
          defaultValue: 'before',
          options: [
            { label: 'Before', value: 'before' },
            { label: 'After', value: 'after' },
          ],
          label: 'Position',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'iconStyles',
          type: 'relationship',
          relationTo: 'styles',
          hasMany: true,
          label: 'Icon Styles',
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ]
}