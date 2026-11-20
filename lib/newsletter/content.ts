import {
  convertLexicalToHTMLAsync,
  LinkHTMLConverterAsync,
} from '@payloadcms/richtext-lexical/html-async';
import type { Payload } from 'payload';
import type { Newsletter } from '@/payload-types';
import { legacyLink, resolveLink, type CmsLink } from '@/lib/links';
import { escapeHtml, safeUrl } from './html';

type RenderContentArgs = {
  articleUrl: string;
  base: string;
  newsletter: Newsletter;
  payload: Payload;
};

export async function renderNewsletterContent({
  articleUrl,
  base,
  newsletter,
  payload,
}: RenderContentArgs): Promise<string> {
  return convertLexicalToHTMLAsync({
    data: newsletter.content,
    populate: async ({ collectionSlug, id }) => {
      if (
        collectionSlug !== 'media' &&
        collectionSlug !== 'pages' &&
        collectionSlug !== 'newsletter' &&
        collectionSlug !== 'services' &&
        collectionSlug !== 'projects'
      ) {
        return undefined;
      }

      return (await payload.findByID({
        collection: collectionSlug,
        id,
        depth: 1,
        overrideAccess: false,
      })) as never;
    },
    converters: ({ defaultConverters }) => ({
      ...defaultConverters,
      ...LinkHTMLConverterAsync({
        internalDocToHref: async ({ linkNode, populate }) => {
          const ref = linkNode.fields.doc;
          if (!ref) return articleUrl;

          const doc =
            typeof ref.value === 'object'
              ? ref.value
              : await populate?.({
                  collectionSlug: ref.relationTo,
                  id: ref.value,
                });
          const slug = (doc as { slug?: string } | undefined)?.slug;
          if (!slug) return articleUrl;

          const prefixes: Record<string, string> = {
            pages: '',
            newsletter: 'newsletters/',
            services: 'services/',
            projects: 'our-work/',
          };
          return safeUrl(`/${prefixes[ref.relationTo] || ''}${slug === 'home' ? '' : slug}`, base);
        },
      }),
      paragraph: async ({
        node,
        nodesToHTML,
        providedCSSString,
        providedDirAttribute,
      }) => {
        const children = (await nodesToHTML({ nodes: node.children })).join('');
        return `<p${providedDirAttribute} style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.75;color:#262626;${providedCSSString}">${children || '<br />'}</p>`;
      },
      heading: async ({
        node,
        nodesToHTML,
        providedCSSString,
        providedDirAttribute,
      }) => {
        const tag = node.tag === 'h3' || node.tag === 'h4' ? node.tag : 'h2';
        const children = (await nodesToHTML({ nodes: node.children })).join('');
        return `<${tag}${providedDirAttribute} style="margin:32px 0 14px;font-family:Georgia,serif;font-size:${tag === 'h2' ? '25px' : '20px'};line-height:1.25;color:#000000;${providedCSSString}">${children}</${tag}>`;
      },
      list: async ({ node, nodesToHTML, providedCSSString, providedDirAttribute }) => {
        const tag = node.tag === 'ol' ? 'ol' : 'ul';
        const children = (await nodesToHTML({ nodes: node.children })).join('');
        return `<${tag}${providedDirAttribute} style="margin:0 0 20px;padding-left:24px;color:#262626;line-height:1.7;${providedCSSString}">${children}</${tag}>`;
      },
      listitem: async ({
        node,
        nodesToHTML,
        parent,
        providedCSSString,
        providedDirAttribute,
      }) => {
        const children = (await nodesToHTML({ nodes: node.children })).join('');
        const check =
          'listType' in parent && parent.listType === 'check'
            ? node.checked
              ? '&#9745; '
              : '&#9744; '
            : '';
        return `<li${providedDirAttribute} style="margin:0 0 8px;${check ? 'list-style:none;' : ''}${providedCSSString}">${check}${children}</li>`;
      },
      quote: async ({ node, nodesToHTML, providedCSSString, providedDirAttribute }) => {
        const children = (await nodesToHTML({ nodes: node.children })).join('');
        return `<blockquote${providedDirAttribute} style="margin:24px 0;padding:4px 0 4px 20px;border-left:4px solid #f97316;color:#262626;${providedCSSString}">${children}</blockquote>`;
      },
      upload: async ({ node, populate }) => {
        const image = (
          typeof node.value === 'object'
            ? node.value
            : await populate?.({ collectionSlug: node.relationTo, id: node.value })
        ) as { url?: string; alt?: string } | undefined;
        if (!image || typeof image.url !== 'string') return '';

        const caption = node.fields?.caption
          ? `<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#525252;">${escapeHtml(node.fields.caption)}</p>`
          : '';
        return `<div style="margin:24px 0;"><img src="${escapeHtml(safeUrl(image.url, base))}" alt="${escapeHtml(image.alt)}" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />${caption}</div>`;
      },
      blocks: {
        linkBlock: async ({ node, populate }) => {
          const fields = node.fields as {
            link?: CmsLink;
            href?: string;
            label?: string;
            style?: string;
          };
          let link = fields.link;

          if (
            link?.type === 'internal' &&
            link.internal &&
            typeof link.internal.value === 'string'
          ) {
            const doc = await populate?.({
              collectionSlug: link.internal.relationTo,
              id: link.internal.value,
            } as never);
            link = { ...link, internal: { ...link.internal, value: doc as never } };
          }

          const resolved = resolveLink(link) ?? legacyLink(fields.href, fields.label);
          if (!resolved) return '';

          const style =
            fields.style === 'link'
              ? 'color:#000000;text-decoration:underline;font-weight:bold;'
              : 'display:inline-block;background:#f97316;color:#000000;text-decoration:none;font-weight:bold;padding:14px 20px;';
          const target = resolved.newTab
            ? ' target="_blank" rel="noopener noreferrer"'
            : '';
          return `<p style="margin:24px 0;"><a href="${escapeHtml(safeUrl(resolved.href, base))}"${target} style="${style}">${escapeHtml(resolved.label)}</a></p>`;
        },
        mediaBlock: async ({ node, populate }) => {
          const fields = node.fields as {
            image?: { url?: string; alt?: string } | string;
            caption?: string;
          };
          const image = (
            typeof fields.image === 'string'
              ? await populate?.({ collectionSlug: 'media', id: fields.image })
              : fields.image
          ) as { url?: string; alt?: string } | undefined;
          if (!image || typeof image !== 'object' || !image.url) return '';

          const caption = fields.caption
            ? `<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#525252;">${escapeHtml(fields.caption)}</p>`
            : '';
          return `<div style="margin:24px 0;"><img src="${escapeHtml(safeUrl(image.url, base))}" alt="${escapeHtml(image.alt)}" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />${caption}</div>`;
        },
      },
    }),
  });
}
