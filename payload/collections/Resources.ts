import type { CollectionConfig } from 'payload';
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

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishDate', 'readTime', 'sortOrder'],
    livePreview: {
      url: ({ data }) => livePreviewUrl({ data, collectionSlug: 'resources' }),
      breakpoints: livePreviewBreakpoints,
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    ...cmsCollectionCacheHooks('resources'),
    beforeValidate: [makeSlugHook('title')],
  },
  fields: [
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
        description: 'Optional image shown on resource cards and its detail page.',
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
            enabledCollections: ['pages', 'resources', 'services', 'projects'],
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
                interfaceName: 'ResourceMediaBlock',
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
                interfaceName: 'ResourceLinkBlock',
                labels: { singular: 'Link / Button Block', plural: 'Link / Button Blocks' },
                fields: [
                  { name: 'label', type: 'text', required: true },
                  { name: 'href', type: 'text', required: true },
                  {
                    name: 'style',
                    type: 'select',
                    options: [
                      { label: 'Button', value: 'button' },
                      { label: 'Plain link', value: 'link' },
                    ],
                    defaultValue: 'button',
                  },
                  { name: 'newTab', type: 'checkbox', defaultValue: false },
                ],
              },
            ],
          }),
        ],
      }),
    },
  ],
  versions: { drafts: { autosave: true } },
};

