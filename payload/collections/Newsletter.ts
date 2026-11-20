import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';
import {
  lexicalEditor,
  BlocksFeature,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
  ParagraphFeature,
  AlignFeature,
  IndentFeature,
  OrderedListFeature,
  UnorderedListFeature,
  ChecklistFeature,
  LinkFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical';
import { cmsCollectionCacheHooks } from '../../lib/cms-cache';
import { livePreviewBreakpoints, livePreviewUrl } from '../../lib/live-preview';
import { slugField, makeSlugHook } from '../fields/slug';
import { linkField } from '../fields/link';

const ATLANTIC_TIMEZONE = 'America/Halifax';

function atlanticDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: ATLANTIC_TIMEZONE,
    year: 'numeric',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  return {
    day: part('day'),
    iso: `${part('year')}-${part('month')}-${part('day')}`,
    label: new Intl.DateTimeFormat('en-CA', {
      day: 'numeric',
      month: 'long',
      timeZone: ATLANTIC_TIMEZONE,
      year: 'numeric',
    }).format(date),
  };
}

/**
 * When a draft is published — either by hand or by a scheduled publish job —
 * stamp the display and ISO dates with the Atlantic-time publish moment.
 * An editor-supplied date change is preserved.
 */
const stampPublishDate: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  const becomingPublished =
    operation === 'update' && data?._status === 'published' && originalDoc?._status !== 'published';
  const editorChangedDate = Boolean(data?.isoDate) && data.isoDate !== originalDoc?.isoDate;

  if (becomingPublished && !editorChangedDate) {
    const now = atlanticDateParts(new Date());
    data.isoDate = now.iso;
    data.publishDate = now.label;
  }

  return data;
};

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  dbName: 'newsletter',
  labels: { singular: 'Newsletter', plural: 'Newsletters' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishDate', 'readTime', 'sortOrder'],
    livePreview: {
      url: ({ data }) => livePreviewUrl({ data, collectionSlug: 'newsletter' }),
      breakpoints: livePreviewBreakpoints,
    },
  },
  access: {
    read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    ...cmsCollectionCacheHooks('newsletter'),
    beforeValidate: [makeSlugHook('title')],
    beforeChange: [stampPublishDate],
  },
  fields: [
    { name: 'sendNewsletter', type: 'ui', admin: { components: { Field: '@/payload/components/admin/SendNewsletter#SendNewsletter' } } },
    slugField('title'),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image shown on newsletter cards and its detail page.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['Guide', 'Checklist', 'Tutorial', 'Case Study', 'Notes'],
    },
    {
      name: 'tags',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'publishDate',
      type: 'text',
      required: true,
    },
    {
      name: 'isoDate',
      type: 'text',
      required: true,
    },
    {
      name: 'readTime',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
          InlineCodeFeature(),
          AlignFeature(),
          IndentFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          ChecklistFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'newsletter', 'services', 'projects'],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  { name: 'caption', type: 'text' },
                  { name: 'size', type: 'select', options: ['full', 'wide', 'medium'], defaultValue: 'wide' },
                ],
              },
            },
          }),
          BlocksFeature({
            blocks: [
              {
                slug: 'mediaBlock',
                interfaceName: 'NewsletterMediaBlock',
                labels: { singular: 'Media Block', plural: 'Media Blocks' },
                fields: [
                  { name: 'image', type: 'upload', relationTo: 'media', required: true },
                  { name: 'caption', type: 'text' },
                  {
                    name: 'size',
                    type: 'select',
                    options: [
                      { label: 'Full width', value: 'full' },
                      { label: 'Wide (default)', value: 'wide' },
                      { label: 'Medium', value: 'medium' },
                    ],
                    defaultValue: 'wide',
                  },
                ],
              },
              {
                slug: 'linkBlock',
                interfaceName: 'NewsletterLinkBlock',
                labels: { singular: 'Link / Button Block', plural: 'Link / Button Blocks' },
                fields: [
                  linkField({ name: 'link', label: 'Link' }),
                  {
                    name: 'style',
                    type: 'select',
                    options: [
                      { label: 'Button', value: 'button' },
                      { label: 'Plain link', value: 'link' },
                    ],
                    defaultValue: 'button',
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
  ],
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: { timeFormat: 'h:mm aa', timeIntervals: 15 },
    },
  },
};

