import type { CollectionSlug, Field, GroupField } from 'payload';

export const LINK_COLLECTIONS: CollectionSlug[] = ['pages', 'services', 'projects', 'newsletter'];

const VALID_URL = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

interface LinkFieldOptions {
  /** Field name; defaults to `link`. */
  name?: string;
  /** Group label; defaults to `Link`. */
  label?: string;
  /** Show the free-text label. Turn off where the surrounding UI already supplies one. */
  withLabel?: boolean;
}

/**
 * Reusable link field: pick a document from Pages, Services, Projects or Newsletters,
 * or provide a custom URL. Resolve at render time with `resolveLink` from `lib/links`.
 */
export function linkField({ name = 'link', label = 'Link', withLabel = true }: LinkFieldOptions = {}): GroupField {
  const fields: Field[] = [];

  if (withLabel) {
    fields.push({
      name: 'label',
      type: 'text',
      label: 'Text to display',
      admin: { description: 'Leave blank to use the linked document title.' },
    });
  }

  fields.push(
    {
      name: 'type',
      type: 'select',
      label: 'Link to',
      required: true,
      defaultValue: 'internal',
      options: [
        { label: 'A page or entry', value: 'internal' },
        { label: 'A custom URL', value: 'external' },
      ],
    },
    {
      name: 'internal',
      type: 'relationship',
      label: 'Page or entry',
      relationTo: LINK_COLLECTIONS,
      admin: { condition: (_, siblingData: any) => siblingData?.type !== 'external' },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      admin: {
        condition: (_, siblingData: any) => siblingData?.type === 'external',
        placeholder: 'https://example.com',
      },
      validate: (value: unknown) => {
        const url = typeof value === 'string' ? value.trim() : '';
        if (!url) return true;
        return VALID_URL.test(url)
          ? true
          : 'Enter a full URL, or an address starting with /, mailto: or tel:.';
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
      defaultValue: false,
    },
  );

  return { name, type: 'group', label, fields };
}
