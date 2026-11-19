import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { s3Storage } from '@payloadcms/storage-s3';
import { resendAdapter } from '@payloadcms/email-resend';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { searchPlugin } from '@payloadcms/plugin-search';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { revalidatePath } from 'next/cache';
import path from 'path';
import { buildConfig, type Config, type Plugin } from 'payload';
import { fileURLToPath } from 'url';
import { getPayloadSeedStatus, seedAllPayloadData } from './lib/seed';
import { livePreviewBreakpoints, livePreviewUrl } from './lib/live-preview';
import { Faqs } from './payload/collections/Faqs';
import { Pages } from './payload/collections/Pages';
import { Projects } from './payload/collections/Projects';
import { Resources } from './payload/collections/Resources';
import { Services } from './payload/collections/Services';
import { Testimonials } from './payload/collections/Testimonials';
import { Users } from './payload/collections/Users';
import { Media } from './payload/collections/Media';
import { Settings } from './payload/globals/Settings';
import { Footer } from './payload/globals/Footer';
import { Navigation } from './payload/globals/Navigation';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function getMediaStoragePlugin(): Plugin {
  const storageAdapter = s3Storage({
    bucket: requireEnv('S3_BUCKET'),
    collections: {
      media: { prefix: 'media' },
    },
    config: {
      credentials: {
        accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
      },
      endpoint: requireEnv('S3_ENDPOINT'),
      forcePathStyle: true,
      region: requireEnv('S3_REGION'),
    },
  }) as unknown as { init: (config: Config) => Config };

  return (config) => storageAdapter.init(config);
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const email = process.env.RESEND_API_KEY
  ? resendAdapter({
      apiKey: requireEnv('RESEND_API_KEY'),
      defaultFromAddress: requireEnv('EMAIL_FROM'),
      defaultFromName: requireEnv('EMAIL_FROM_NAME'),
    })
  : await nodemailerAdapter({
      defaultFromAddress: requireEnv('EMAIL_FROM'),
      defaultFromName: requireEnv('EMAIL_FROM_NAME'),
      transportOptions: process.env.SMTP_HOST
        ? {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER && process.env.SMTP_PASS
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              : undefined,
          }
        : undefined,
      skipVerify: true,
    });

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '— CMS' },
    components: { beforeDashboard: ['./components/payload/SeedBanner#SeedBanner'] },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) =>
        livePreviewUrl({ data, collectionConfig, globalConfig }),
      breakpoints: livePreviewBreakpoints,
      openByDefault: true,
    },
  },
  serverURL: requireEnv('NEXT_PUBLIC_APP_URL'),
  cors: [requireEnv('NEXT_PUBLIC_APP_URL')],
  email,
  collections: [Pages, Services, Projects, Resources, Faqs, Testimonials, Media, Users],
  globals: [Settings, Navigation, Footer],
  editor: lexicalEditor(),
  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: requireEnv('DATABASE_URI') }),
  plugins: [
    getMediaStoragePlugin(),
    redirectsPlugin({ collections: ['pages', 'services', 'projects', 'resources'] }),
    searchPlugin({
      collections: ['pages', 'services', 'projects', 'resources', 'faqs'],
      defaultPriorities: { pages: 20, services: 15, projects: 12, resources: 10, faqs: 8 },
    }),
    seoPlugin({
      collections: ['pages', 'services', 'projects', 'resources'],
      globals: ['settings', 'footer', 'navigation'],
      tabbedUI: true,
      generateTitle: ({ doc }) => String(doc?.title || doc?.name || ''),
      generateDescription: ({ doc }) =>
        String(doc?.metaDescription || doc?.excerpt || doc?.summary || doc?.description || ''),
      generateURL: ({ doc, collectionSlug }) => {
        if (!doc?.slug) return requireEnv('NEXT_PUBLIC_APP_URL');
        const prefixes: Record<string, string> = {
          pages: '', services: '/services/', projects: '/our-work/', resources: '/resources/',
        };
        const prefix = collectionSlug ? prefixes[collectionSlug] : undefined;
        return `${requireEnv('NEXT_PUBLIC_APP_URL').replace(/\/+$/, '')}${prefix || '/'}${doc.slug}`;
      },
    }),
    formBuilderPlugin({
      defaultToEmail: process.env.EMAIL_TO,
      redirectRelationships: ['pages'],
      fields: { payment: false, state: false, country: true, date: true, time: true, upload: false },
      formSubmissionOverrides: {
        access: {
          read: ({ req }) => Boolean(req.user),
          create: () => true,
          update: ({ req }) => Boolean(req.user),
          delete: ({ req }) => Boolean(req.user),
        },
      },
    }),
  ],
  endpoints: [
    {
      path: '/seed',
      method: 'get',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Authentication required.' }, { status: 401 });
        return Response.json(await getPayloadSeedStatus(req.payload));
      },
    },
    {
      path: '/seed',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Authentication required.' }, { status: 401 });
        try {
          const report = await seedAllPayloadData(req.payload);
          revalidatePath('/', 'layout');
          return Response.json({ ok: true, report, status: await getPayloadSeedStatus(req.payload) });
        } catch (error) {
          return Response.json({ ok: false, error: error instanceof Error ? error.message : 'Seed failed.' }, { status: 500 });
        }
      },
    },
  ],
});
