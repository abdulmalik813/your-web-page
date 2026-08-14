import { revalidateSocial } from '@/hooks/revalidate-globals'
import { GlobalConfig } from 'payload'

export const Social: GlobalConfig = {
  slug: 'social',
  label: 'Social Media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'facebook',
      label: 'Facebook URL',
      type: 'text',
      required: false,
    },
    {
      name: 'instagram',
      label: 'Instagram URL',
      type: 'text',
      required: false,
    },
    {
      name: 'x',
      label: 'X (formerly Twitter) URL',
      type: 'text',
      required: false,
    },
    {
      name: 'linkedin',
      label: 'LinkedIn URL',
      type: 'text',
      required: false,
    },
    {
      name: 'youtube',
      label: 'YouTube URL',
      type: 'text',
      required: false,
    },
    {
      name: 'tiktok',
      label: 'TikTok URL',
      type: 'text',
      required: false,
    },
  ],
  hooks: {
    afterChange: [revalidateSocial],
  },
}