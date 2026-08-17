import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from '@/collections/users'
import { Media } from '@/collections/media'
import { Pages } from '@/collections/pages/config'
import { Styles } from '@/collections/styles/config'
import { getServerSideURL } from '@/lib/get-url'
import { plugins } from '@/plugins/default'
import { defaultLexical } from '@/fields/lexical-field'
import { Icons } from '@/collections/icons'
import { CRON_SECRET, DATABASE_URI, EMAIL, PAYLOAD, TIMEZONES } from '@/constants/init'
import { Settings } from '@/globals/settings'
import { NavigationBar } from '@/globals/navigation-bar'
import { Footer } from '@/globals/footer'
import { Posts } from '@/collections/posts/config'
import { Categories } from '@/collections/categories'
import { Testimonials } from '@/collections/testimonials'
import { FAQs } from '@/collections/faq'
import { Social } from '@/globals/social'
import { Thumbnails } from '@/collections/thumbnails'
import { FontFiles } from '@/collections/fonts'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    timezones: {
      supportedTimezones: [...TIMEZONES.SUPPORTED_TIMEZONES],
      defaultTimezone: TIMEZONES.DEFAULT_TIMEZONE,
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    components: {
      graphics: {
        Logo: '/components/admin/logo#default',
      },
      afterNavLinks: [
        '/components/admin/invalidate-cache#CacheInvalidationButton',
        '/components/admin/refresh-styles#RefreshStylesButton',
      ],
    },
  },
  email: EMAIL.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: EMAIL.FROM_ADDRESS,
        defaultFromName: EMAIL.FROM_NAME,
        apiKey: EMAIL.RESEND_API_KEY,
      })
    : nodemailerAdapter({
        defaultFromAddress: EMAIL.FROM_ADDRESS,
        defaultFromName: EMAIL.FROM_NAME,
        transportOptions: {
          host: EMAIL.SMTP_HOST,
          port: EMAIL.SMTP_PORT,
          secure: EMAIL.SMTP_SECURE,
          auth: {
            user: EMAIL.SMTP_USER,
            pass: EMAIL.SMTP_PASS,
          },
        },
      }),
  collections: [
    Pages,
    Posts,
    Categories,
    Users,
    Media,
    Thumbnails,
    Styles,
    Icons,
    Testimonials,
    FAQs,
    FontFiles,
  ],
  globals: [NavigationBar, Footer, Settings, Social],
  cors: [getServerSideURL()].filter(Boolean),
  editor: defaultLexical(),
  secret: PAYLOAD.SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: DATABASE_URI,
  }),
  sharp,
  serverURL: getServerSideURL(),
  plugins: [...plugins],
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${CRON_SECRET}`
      },
    },
  },
})
