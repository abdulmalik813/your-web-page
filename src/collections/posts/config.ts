import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from 'payload'
import { revalidatePost, revalidateDelete, populatePublishedAt } from '@/collections/posts/hooks'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { hero } from '@/fields/hero'
import { Blocks } from '@/blocks/block'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting } from '@/payload-types'
import { grid } from '@/fields/grid'

let cachedPostEnabled: boolean | null = null
let cachedPostLabel: string = 'Posts'

const checkPostEnabled = async (): Promise<boolean> => {
  try {
    const setting = (await getCachedGlobal('settings', 1, true)) as Setting
    cachedPostEnabled = setting?.enablePost ?? false
    cachedPostLabel = setting?.postListingPageTitle || 'Posts'
    return cachedPostEnabled
  } catch {
    cachedPostEnabled = false
    return false
  }
}

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: {
    singular: () => cachedPostLabel,
    plural: () => cachedPostLabel,
  },
  access: {
    create: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return authenticated({ req })
    },
    delete: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return authenticated({ req })
    },
    read: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return authenticatedOrPublished({ req })
    },
    update: async ({ req }) => {
      if (!req.payload) return false
      await checkPostEnabled()
      if (!cachedPostEnabled) return false
      return authenticated({ req })
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
    hidden: ({ user }) => {
      if (user?.payload) {
        checkPostEnabled()
      }
      return cachedPostEnabled === false
    },
    livePreview: {
      url: async ({ data, req }) => {
        if (!req.payload) return ''
        const setting = await req.payload.findGlobal({
          slug: 'settings',
        })
        const postSlug = setting?.postSlug || 'posts'
        return generatePreviewPath(`${postSlug}/${data?.slug}`)
      },
    },
    preview: async (data, { req }) => {
      if (!req.payload) return ''
      const setting = await req.payload.findGlobal({
        slug: 'settings',
      })
      const postSlug = setting?.postSlug || 'posts'
      return generatePreviewPath(`${postSlug}/${data?.slug}`)
    },
    listSearchableFields: ['title', 'slug'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
    publishedAt: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      defaultValue: 5,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'array',
              fields: [
                {
                  type: 'tabs',
                  tabs: [
                    {
                      label: 'Content',
                      fields: [
                        {
                          name: 'grid',
                          type: 'array',
                          fields: [
                            grid(),
                            {
                              name: 'blocks',
                              type: 'blocks',
                              blocks: Blocks({
                                dbPrefix: 'pst',
                              }),
                              required: false,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      label: 'Styles',
                      fields: [
                        {
                          name: 'container',
                          type: 'checkbox',
                        },
                        {
                          name: 'gapSize',
                          type: 'select',
                          required: true,
                          defaultValue: 'medium',
                          options: [
                            {
                              label: 'None',
                              value: 'none',
                            },
                            {
                              label: 'Small',
                              value: 'small',
                            },
                            {
                              label: 'Medium',
                              value: 'medium',
                            },
                            {
                              label: 'Large',
                              value: 'large',
                            },
                            {
                              label: 'Extra Large',
                              value: 'xlarge',
                            },
                          ],
                        },
                        {
                          name: 'styles',
                          type: 'relationship',
                          relationTo: 'styles',
                          hasMany: true,
                          label: 'Layout Styles',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
