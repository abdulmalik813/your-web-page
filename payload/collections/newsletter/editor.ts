import {
  AlignFeature,
  BlocksFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical';
import { linkField } from '../../fields/link';

export function newsletterEditor() {
  return lexicalEditor({
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
              {
                name: 'size',
                type: 'select',
                options: ['full', 'wide', 'medium'],
                defaultValue: 'wide',
              },
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
  });
}
