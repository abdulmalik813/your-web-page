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
import sharp from 'sharp';
import Handlebars from 'handlebars';
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';
import { getPayload } from 'payload';
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
import { sharpTransformer } from '@payloadcms/transformer-sharp';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// ─── Handlebars helpers ───────────────────────────────────────────────────────
type SubmissionField = { field: string; value: unknown };

Handlebars.registerHelper('now', () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Halifax',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()),
);

Handlebars.registerHelper('script', function (codeString: string, options: Handlebars.HelperOptions) {
  try {
    const ctx = (options.data as { root?: Record<string, unknown> }).root ?? {};
    return new Function('context', `with(context){return(${codeString})}`)(ctx) ?? '';
  } catch (e) {
    console.error('[Handlebars] script error:', e);
    return '';
  }
});

function processWithHandlebars(template: string, data: SubmissionField[]): string {
  if (!template) return '';
  const context = data.reduce<Record<string, unknown>>((acc, { field, value }) => {
    acc[field] = value;
    return acc;
  }, {});
  try {
    return Handlebars.compile(template)(context);
  } catch (e) {
    console.error('[Handlebars] compilation error:', e);
    return '';
  }
}

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
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) =>
        livePreviewUrl({ data, collectionConfig, globalConfig }),
      breakpoints: livePreviewBreakpoints,
      openByDefault: true,
    },
    components: {
      afterNavLinks: [
        '@/payload/components/admin/CacheBustButton#CacheBustButton',
      ],
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
    getMediaStoragePlugin(),
    redirectsPlugin({ collections: ['pages', 'services', 'projects', 'resources'] }),
    searchPlugin({
      collections: ['pages', 'services', 'projects', 'resources', 'faqs'],
      defaultPriorities: { pages: 20, services: 15, projects: 12, resources: 10, faqs: 8 },
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        category: originalDoc?.category,
        excerpt: originalDoc?.excerpt || originalDoc?.metaDescription || originalDoc?.summary,
        slug: originalDoc?.slug,
      }),
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: 'category', type: 'text' },
          { name: 'excerpt', type: 'textarea' },
          { name: 'slug', type: 'text' },
        ],
      },
    }),
    seoPlugin({
      collections: ['pages', 'services', 'projects', 'resources', 'testimonials'],
      globals: ['settings', 'footer', 'navigation'],
      tabbedUI: true,
      generateTitle: ({ doc }) => String(doc?.title || doc?.name || doc?.authorName || ''),
      generateDescription: ({ doc }) =>
        String(doc?.metaDescription || doc?.excerpt || doc?.summary || doc?.description || doc?.quote || ''),
      generateURL: ({ doc, collectionSlug }) => {
        if (!doc?.slug) return requireEnv('NEXT_PUBLIC_APP_URL');
        const prefixes: Record<string, string> = {
          pages: '', services: '/services/', projects: '/our-work/', resources: '/resources/', testimonials: '/testimonials/',
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
      beforeEmail: async (emailsToSend, params) => {
        // params is the hook args object; fall back to raw emailsToSend if something is missing
        const payload = (params as any)?.req?.payload ?? await getPayload({ config: (await import('@payload-config')).default });
        const submissionData: SubmissionField[] = ((params as any)?.data?.submissionData ?? []) as SubmissionField[];
        const formRef = (params as any)?.data?.form;
        const formId = typeof formRef === 'string' ? formRef : (formRef as any)?.id;

        if (!formId) return emailsToSend;

        let formDoc: any;
        try {
          formDoc = await payload.findByID({ collection: 'forms', id: formId });
        } catch {
          return emailsToSend;
        }

        const emails: any[] = [];
        for (const emailConfig of (formDoc?.emails ?? []) as any[]) {
          let messageContent = '';
          if (emailConfig.messageType === 'html') {
            messageContent = String(emailConfig.htmlMessage ?? '');
          } else if (emailConfig.message && typeof emailConfig.message === 'object') {
            try {
              messageContent = convertLexicalToHTML({ data: emailConfig.message as any });
            } catch {
              messageContent = '';
            }
          } else if (typeof emailConfig.message === 'string') {
            messageContent = emailConfig.message;
          }
          emails.push({
            to: processWithHandlebars(String(emailConfig.emailTo ?? ''), submissionData),
            subject: processWithHandlebars(String(emailConfig.subject ?? ''), submissionData),
            from: processWithHandlebars(String(emailConfig.emailFrom ?? ''), submissionData),
            cc: processWithHandlebars(String(emailConfig.cc ?? ''), submissionData),
            bcc: processWithHandlebars(String(emailConfig.bcc ?? ''), submissionData),
            replyTo: processWithHandlebars(String(emailConfig.replyTo ?? ''), submissionData),
            html: processWithHandlebars(messageContent, submissionData),
          });
        }
        return emails.length ? emails : emailsToSend;
      },
      formOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields.map((field: any) => {
            if (field.name === 'emails') {
              return {
                ...field,
                admin: {
                  ...(field.admin ?? {}),
                  description:
                    "Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}. Handlebars expressions are supported.",
                },
                fields: (field.fields ?? []).flatMap((f: any) => {
                  if (f.name === 'message') {
                    const modifiedMessage = {
                      ...f,
                      admin: {
                        ...(f.admin ?? {}),
                        condition: (_: any, siblingData: any) => siblingData?.messageType !== 'html',
                      },
                    };
                    return [
                      {
                        name: 'messageType',
                        type: 'select',
                        defaultValue: 'rich_text',
                        required: true,
                        options: [
                          { label: 'Rich Text', value: 'rich_text' },
                          { label: 'Custom HTML', value: 'html' },
                        ],
                      },
                      modifiedMessage,
                      {
                        name: 'htmlMessage',
                        type: 'code',
                        label: 'HTML Message',
                        admin: {
                          language: 'html',
                          condition: (_: any, siblingData: any) => siblingData?.messageType === 'html',
                        },
                      },
                    ];
                  }
                  return [f];
                }),
              };
            }
            return field;
          }),
        ],
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
