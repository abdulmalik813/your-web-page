import { Block } from 'payload'

export const TimeBlock: Block = {
  slug: 'time',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name (lowercase, no special characters)',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'number',
          label: 'Field Width (percentage)',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          label: 'Default Value',
          admin: {
            width: '50%',
          },
          validate: (value: string | undefined | null) => {
            if (!value || value.trim() === '') {
              return true
            }
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(value)) {
              return 'Please enter a valid time in HH:MM format (e.g., 14:30)'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'required',
      type: 'checkbox',
      label: 'Required',
    },
  ],
  labels: {
    plural: 'Time Fields',
    singular: 'Time',
  },
}
