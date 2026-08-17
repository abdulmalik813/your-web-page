import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/lib/get-url'
import { s3Storage } from '@payloadcms/storage-s3'
import { revalidateDeletedRedirects, revalidateRedirects } from '@/hooks/revalidate-redirects'
import { TimeBlock } from '@/fields/time'
import { S3 } from '@/constants/init'
import { navLocation } from '@/fields/nav-location'
import { formOverrides } from '@/fields/form-overrides'
import { FormattedEmail } from 'node_modules/@payloadcms/plugin-form-builder/dist/types'

const generateTitle: GenerateTitle<Page | Post> = async ({ doc, req }) => {
  const setting = await req.payload.findGlobal({
    slug: 'settings',
  })

  const title = setting?.appTitle || ''
  return doc?.title ? `${doc.title} | ${title}` : title
}

const generateURL: GenerateURL<Page | Post> = async ({ doc, req, collectionSlug }) => {
  const url = getServerSideURL()
  if (collectionSlug === 'posts') {
    const setting = await req.payload.findGlobal({
      slug: 'settings',
    })
    return doc?.slug ? `${url}/${setting.postSlug || 'posts'}/${doc.slug}` : url
  }
  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    overrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'to') {
            return {
              ...field,
              fields: navLocation(),
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
        afterDelete: [revalidateDeletedRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  searchPlugin({
    collections: ['posts'],
    defaultPriorities: {
      posts: 10,
      pages: 20,
    },
    searchOverrides: {
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'description',
          type: 'textarea',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    beforeSync: ({ originalDoc, searchDoc }) => {
      if ('meta' in originalDoc && originalDoc.meta && 'description' in originalDoc.meta) {
        return {
          ...searchDoc,
          description: originalDoc.meta.description || '',
        }
      }
      return searchDoc
    },
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      state: false,
      country: false,
      date: true,
      time: TimeBlock,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.flatMap((field) => {
          if (
            'name' in field &&
            (field.name === 'submitButtonLabel' || field.name === 'confirmationMessage')
          ) {
            return []
          }

          if ('name' in field && field.name === 'confirmationType') {
            return [field, ...formOverrides]
          }

          return [field]
        })
      },
    },
    beforeEmail: (emailsToSend, _submissionData) => {
      return emailsToSend.map((email): FormattedEmail => {
        // 1. Strip all HTML tags from the existing html field content
        const plainTextContent = (email.html || '').replace(/<[^>]*>?/gm, '')

        return {
          to: email.to,
          from: email.from,
          subject: email.subject,
          replyTo: email.replyTo,
          cc: email.cc,
          bcc: email.bcc,
          // 2. Assign the clean plain text string to 'html' to satisfy the interface type
          html: plainTextContent,
        }
      })
    },
  }),
  s3Storage({
    collections: {
      media: {
        prefix: 'app',
        generateFileURL: ({ filename }) => {
          return `/api/media/file/${filename}`
        },
        signedDownloads: {
          shouldUseSignedURL: ({ filename }) => {
            return filename.endsWith('.mp4')
          },
        },
      },
      thumbnails: {
        prefix: 'thumbnails',
        generateFileURL: ({ filename }) => {
          return `/api/thumbnails/file/${filename}`
        },
        signedDownloads: {
          shouldUseSignedURL: ({ filename }) => {
            return filename.endsWith('.mp4')
          },
        },
      },
      'font-files': {
        prefix: 'font-files',
        generateFileURL: ({ filename }) => {
          return `/api/font-files/file/${filename}`
        },
      },
    },
    bucket: S3.BUCKET,
    clientUploads: true,
    config: {
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
      credentials: {
        accessKeyId: S3.ACCESS_KEY_ID,
        secretAccessKey: S3.SECRET_ACCESS_KEY,
      },
      region: S3.REGION,
      endpoint: S3.ENDPOINT,
    },
  }),
  payloadCloudPlugin(),
]
