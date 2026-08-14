import { CollapsibleField, Field, deepMerge } from 'payload'

type GridType = (options?: { overrides?: Partial<CollapsibleField> }) => Field

export const grid: GridType = ({ overrides = {} } = {}) => {
  const gridResult: CollapsibleField = {
    label: 'Grid',
    type: 'collapsible',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'gridSize',
            type: 'select',
            defaultValue: 'full',
            required: true,
            admin: {
              width: '50%',
            },
            options: [
              {
                label: 'Full Width',
                value: 'full',
              },
              {
                label: 'Three Quarters (3/4)',
                value: 'three-quarters',
              },
              {
                label: 'Two Thirds (2/3)',
                value: 'two-thirds',
              },
              {
                label: 'Half (1/2)',
                value: 'half',
              },
              {
                label: 'One Third (1/3)',
                value: 'one-third',
              },
              {
                label: 'One Quarter (1/4)',
                value: 'one-quarter',
              },
            ],
          },
          {
            name: 'gridStyles',
            type: 'relationship',
            relationTo: 'styles',
            hasMany: true,
            admin: {
              width: '50%',
            },
          },
        ],
      },
    ],
  }

  return deepMerge(gridResult, overrides)
}
