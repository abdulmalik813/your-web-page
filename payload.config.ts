import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { sharpTransformer } from '@payloadcms/transformer-sharp';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { requireEnv } from './lib/env';
import { getAllowedOrigins, getServerSideURL } from './lib/get-url';
import { livePreviewBreakpoints, livePreviewUrl } from './lib/live-preview';
import { seedEndpoints } from './payload/endpoints/seed';
import { createEmailAdapter } from './payload/plugins/email';
import { createFormBuilderPlugin } from './payload/plugins/formBuilder';
import { createMediaStoragePlugin } from './payload/plugins/mediaStorage';
import { createSearchPlugin } from './payload/plugins/search';
import { createSeoPlugin } from './payload/plugins/seo';
import { Faqs } from './payload/collections/Faqs';
import { Media } from './payload/collections/Media';
import { Newsletter } from './payload/collections/Newsletter';
import { Pages } from './payload/collections/Pages';
import { Projects } from './payload/collections/Projects';
import { Services } from './payload/collections/Services';
import { Subscribers } from './payload/collections/Subscribers';
import { Testimonials } from './payload/collections/Testimonials';
import { Users } from './payload/collections/Users';
import { Footer } from './payload/globals/Footer';
import { Navigation } from './payload/globals/Navigation';
import { Settings } from './payload/globals/Settings';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = getAllowedOrigins();

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '— CMS' },
    timezones: {
      defaultTimezone: 'America/Halifax',
      supportedTimezones: [
        { label: 'Atlantic — Halifax', value: 'America/Halifax' },
        { label: 'Newfoundland — St. John’s', value: 'America/St_Johns' },
        { label: 'Eastern — Toronto', value: 'America/Toronto' },
        { label: 'Central — Winnipeg', value: 'America/Winnipeg' },
        { label: 'Mountain — Edmonton', value: 'America/Edmonton' },
        { label: 'Pacific — Vancouver', value: 'America/Vancouver' },
        { label: 'UTC', value: 'UTC' },
      ],
    },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) =>
        livePreviewUrl({ data, collectionConfig, globalConfig }),
      breakpoints: livePreviewBreakpoints,
      openByDefault: true,
    },
    components: {
      afterNavLinks: ['@/payload/components/admin/CacheBustButton#CacheBustButton'],
    },
  },
  serverURL: getServerSideURL(),
  cors: allowedOrigins,
  csrf: allowedOrigins,
  email: await createEmailAdapter(),
  collections: [
    Pages,
    Services,
    Projects,
    Newsletter,
    Subscribers,
    Faqs,
    Testimonials,
    Media,
    Users,
  ],
  jobs: {
    // Scheduled publishes need a long-running Node process (`next start`).
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 10 }],
  },
  globals: [Settings, Navigation, Footer],
  editor: lexicalEditor(),
  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: requireEnv('DATABASE_URI') }),
  upload: {
    transformers: [
      sharpTransformer({
        sharp,
        collections: {
          media: {
            focalPoint: true,
            variants: [
              { name: 'thumbnail', width: 300 },
              { name: 'square', width: 500, height: 500 },
              { name: 'small', width: 600 },
              { name: 'medium', width: 900 },
              { name: 'large', width: 1400 },
              { name: 'xlarge', width: 1920 },
              { name: 'og', width: 1200, height: 630, crop: 'center' },
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    createMediaStoragePlugin(),
    redirectsPlugin({ collections: ['pages', 'services', 'projects', 'newsletter'] }),
    createSearchPlugin(),
    createSeoPlugin(),
    createFormBuilderPlugin(),
  ],
  endpoints: seedEndpoints,
});
