import { Block } from 'payload'

export const DividerBlock = (dbPrefix: string = ''): Block => ({
  slug: 'dividerBlock',
  interfaceName: 'DividerBlock',
  dbName: `${dbPrefix}divider`,
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Divider Type',
      defaultValue: 'line',
      options: [
        { label: 'Simple Line', value: 'line' },
        { label: 'Dashed Line', value: 'dashed' },
        { label: 'Dotted Line', value: 'dotted' },
        { label: 'Double Line', value: 'double' },
        { label: 'Gradient Line', value: 'gradient' },
        { label: 'Wave', value: 'wave' },
        { label: 'Curve', value: 'curve' },
        { label: 'Angle', value: 'angle' },
        { label: 'Triangle', value: 'triangle' },
        { label: 'Arrow', value: 'arrow' },
        { label: 'Zigzag', value: 'zigzag' },
        { label: 'Spacer', value: 'spacer' },
        { label: 'Fade', value: 'fade' },
      ],
    },
    {
      name: 'height',
      type: 'select',
      label: 'Height',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xlarge' },
      ],
    },
    {
      name: 'color',
      type: 'select',
      label: 'Color',
      defaultValue: 'neutral',
      options: [
        { label: 'Neutral', value: 'neutral' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.type !== 'spacer',
      },
    },
    {
      name: 'flip',
      type: 'checkbox',
      label: 'Flip Vertically',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) =>
          ['wave', 'curve', 'angle', 'triangle', 'arrow'].includes(siblingData?.type),
        description: 'Flip the divider upside down',
      },
    },
    {
      name: 'dividerStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
      label: 'Divider Styles',
    },
  ],
  graphQL: {
    singularName: 'DividerBlock',
  },
})
