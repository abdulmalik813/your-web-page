import config from '@payload-config';
import { getPayload } from 'payload';
import { convertLexicalToHTMLAsync, LinkHTMLConverterAsync } from '@payloadcms/richtext-lexical/html-async';
import { getServerSideURL } from '@/lib/get-url';
import { getSocialLinks } from '@/data/company';
import { legacyLink, resolveLink, type CmsLink } from '@/lib/links';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);
}

function safeUrl(value: unknown, base: string): string {
  const raw = String(value || '');
  if (/^(mailto:|tel:)/i.test(raw)) return raw;
  try {
    const url = new URL(raw, base);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : base;
  } catch { return base; }
}

export async function POST(request: Request) {
  const base = getServerSideURL();
  if (!base || request.headers.get('origin') !== base) return Response.json({ message: 'Invalid request origin or site URL configuration.' }, { status: 403 });
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return Response.json({ message: 'Authentication required.' }, { status: 401 });
  if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) return Response.json({ message: 'Configure RESEND_API_KEY or SMTP_HOST before sending newsletters.' }, { status: 503 });

  let id: unknown;
  try { id = (await request.json()).id; } catch { return Response.json({ message: 'Invalid newsletter.' }, { status: 400 }); }
  if (typeof id !== 'string' && typeof id !== 'number') return Response.json({ message: 'Invalid newsletter.' }, { status: 400 });

  try {
    const newsletter = await payload.findByID({ collection: 'newsletter', id, draft: false, overrideAccess: false, depth: 2 });
    if (!newsletter || newsletter._status !== 'published') return Response.json({ message: 'Publish the newsletter before sending.' }, { status: 400 });
    const articleUrl = `${base}/newsletters/${encodeURIComponent(newsletter.slug)}`;
    const settings = await payload.findGlobal({ slug: 'settings', depth: 0, overrideAccess: false });
    const socialLinks = getSocialLinks(settings.social);
    const socialHtml = socialLinks.length
      ? `<p style="margin:0 0 8px;">${socialLinks.map(({ label, href }) => `<a href="${escapeHtml(href)}" style="color:#262626;text-decoration:underline;">${escapeHtml(label)}</a>`).join(' &nbsp; · &nbsp; ')}</p>`
      : '';
    const wordmark = escapeHtml(settings.shortMark || settings.brand);
    const brand = escapeHtml(settings.brand);
    const title = escapeHtml(newsletter.title);
    const excerpt = escapeHtml(newsletter.excerpt);
    const publishDate = escapeHtml(newsletter.publishDate);
    const hero = typeof newsletter.image === 'object' && newsletter.image?.url
      ? `<img src="${escapeHtml(safeUrl(newsletter.image.url, base))}" alt="${escapeHtml(newsletter.image.alt || newsletter.title)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />`
      : '';
    const html = await convertLexicalToHTMLAsync({
      data: newsletter.content,
      populate: async ({ collectionSlug, id }) => {
        if (collectionSlug !== 'media' && collectionSlug !== 'pages' && collectionSlug !== 'newsletter' && collectionSlug !== 'services' && collectionSlug !== 'projects') return undefined;
        return await payload.findByID({ collection: collectionSlug, id, depth: 1, overrideAccess: false }) as never;
      },
      converters: ({ defaultConverters }) => ({
        ...defaultConverters,
        ...LinkHTMLConverterAsync({
          internalDocToHref: async ({ linkNode, populate }) => {
            const ref = linkNode.fields.doc;
            if (!ref) return articleUrl;
            const doc = typeof ref.value === 'object' ? ref.value : await populate?.({ collectionSlug: ref.relationTo, id: ref.value });
            const slug = (doc as { slug?: string } | undefined)?.slug;
            if (!slug) return articleUrl;
            const prefixes: Record<string, string> = { pages: '', newsletter: 'newsletters/', services: 'services/', projects: 'our-work/' };
            return safeUrl(`/${prefixes[ref.relationTo] || ''}${slug === 'home' ? '' : slug}`, base);
          },
        }),
        paragraph: async ({ node, nodesToHTML, providedCSSString, providedDirAttribute }) => {
          const children = (await nodesToHTML({ nodes: node.children })).join('');
          return `<p${providedDirAttribute} style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.75;color:#262626;${providedCSSString}">${children || '<br />'}</p>`;
        },
        heading: async ({ node, nodesToHTML, providedCSSString, providedDirAttribute }) => {
          const tag = node.tag === 'h3' || node.tag === 'h4' ? node.tag : 'h2';
          const children = (await nodesToHTML({ nodes: node.children })).join('');
          return `<${tag}${providedDirAttribute} style="margin:32px 0 14px;font-family:Georgia,serif;font-size:${tag === 'h2' ? '25px' : '20px'};line-height:1.25;color:#000000;${providedCSSString}">${children}</${tag}>`;
        },
        list: async ({ node, nodesToHTML, providedCSSString, providedDirAttribute }) => {
          const tag = node.tag === 'ol' ? 'ol' : 'ul';
          const children = (await nodesToHTML({ nodes: node.children })).join('');
          return `<${tag}${providedDirAttribute} style="margin:0 0 20px;padding-left:24px;color:#262626;line-height:1.7;${providedCSSString}">${children}</${tag}>`;
        },
        listitem: async ({ node, nodesToHTML, parent, providedCSSString, providedDirAttribute }) => {
          const children = (await nodesToHTML({ nodes: node.children })).join('');
          const check = 'listType' in parent && parent.listType === 'check' ? (node.checked ? '&#9745; ' : '&#9744; ') : '';
          return `<li${providedDirAttribute} style="margin:0 0 8px;${check ? 'list-style:none;' : ''}${providedCSSString}">${check}${children}</li>`;
        },
        quote: async ({ node, nodesToHTML, providedCSSString, providedDirAttribute }) => {
          const children = (await nodesToHTML({ nodes: node.children })).join('');
          return `<blockquote${providedDirAttribute} style="margin:24px 0;padding:4px 0 4px 20px;border-left:4px solid #f97316;color:#262626;${providedCSSString}">${children}</blockquote>`;
        },
        upload: async ({ node, populate }) => {
          const image = (typeof node.value === 'object' ? node.value : await populate?.({ collectionSlug: node.relationTo, id: node.value })) as { url?: string; alt?: string } | undefined;
          if (!image || typeof image.url !== 'string') return '';
          const caption = node.fields?.caption ? `<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#525252;">${escapeHtml(node.fields.caption)}</p>` : '';
          return `<div style="margin:24px 0;"><img src="${escapeHtml(safeUrl(image.url, base))}" alt="${escapeHtml(image.alt)}" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />${caption}</div>`;
        },
        blocks: {
          linkBlock: async ({ node, populate }) => {
            const fields = node.fields as { link?: CmsLink; href?: string; label?: string; style?: string };
            let link = fields.link;
            if (link?.type === 'internal' && link.internal && typeof link.internal.value === 'string') {
              const doc = await populate?.({ collectionSlug: link.internal.relationTo, id: link.internal.value } as any);
              link = { ...link, internal: { ...link.internal, value: doc as any } };
            }
            const resolved = resolveLink(link) ?? legacyLink(fields.href, fields.label);
            if (!resolved) return '';
            const style = fields.style === 'link'
              ? 'color:#000000;text-decoration:underline;font-weight:bold;'
              : 'display:inline-block;background:#f97316;color:#000000;text-decoration:none;font-weight:bold;padding:14px 20px;';
            const target = resolved.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<p style="margin:24px 0;"><a href="${escapeHtml(safeUrl(resolved.href, base))}"${target} style="${style}">${escapeHtml(resolved.label)}</a></p>`;
          },
          mediaBlock: async ({ node, populate }) => {
            const fields = node.fields as { image?: { url?: string; alt?: string } | string; caption?: string };
            const image = (typeof fields.image === 'string' ? await populate?.({ collectionSlug: 'media', id: fields.image }) : fields.image) as { url?: string; alt?: string } | undefined;
            if (!image || typeof image !== 'object' || !image.url) return '';
            const caption = fields.caption ? `<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#525252;">${escapeHtml(fields.caption)}</p>` : '';
            return `<div style="margin:24px 0;"><img src="${escapeHtml(safeUrl(image.url, base))}" alt="${escapeHtml(image.alt)}" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />${caption}</div>`;
          },
        },
      }),
    });
    let sent = 0;
    let failed = 0;
    let lastId: string | undefined;
    let hasNextPage = true;
    while (hasNextPage) {
      const subscribers = await payload.find({ collection: 'subscribers', where: { and: [{ status: { equals: 'subscribed' } }, ...(lastId ? [{ id: { greater_than: lastId } }] : [])] }, limit: 100, sort: 'id', overrideAccess: true, showHiddenFields: true });
      for (const subscriber of subscribers.docs) {
        // Recheck status immediately before delivery, including unsubscribe requests made during a send.
        const current = await payload.findByID({ collection: 'subscribers', id: subscriber.id, overrideAccess: true, showHiddenFields: true });
        if (current.status !== 'subscribed') continue;
        const unsubscribeUrl = `${base}/unsubscribe?token=${encodeURIComponent(current.unsubscribeToken)}`;
        const oneClickUrl = `${base}/api/newsletter/unsubscribe?token=${encodeURIComponent(current.unsubscribeToken)}`;
        try {
          await payload.sendEmail({
            to: current.email,
            subject: newsletter.title,
            html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;color:#000000;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${excerpt}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f4;"><tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #000000;">
      <tr><td style="padding:24px 30px;border-bottom:1px solid #000000;"><a href="${escapeHtml(base)}" style="display:inline-block;border:1px solid #000000;padding:10px 12px;color:#000000;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;letter-spacing:0.04em;text-decoration:none;">${wordmark}</a></td></tr>
      <tr><td style="padding:36px 30px 24px;background:#fff7ed;border-bottom:1px solid #000000;">
        <p style="margin:0 0 14px;color:#9a3412;font-family:Courier New,monospace;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">Newsletter${publishDate ? ` &nbsp; / &nbsp; ${publishDate}` : ''}</p>
        <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:36px;line-height:1.12;font-weight:normal;letter-spacing:-0.03em;color:#000000;">${title}</h1>
        <p style="margin:0;color:#262626;font-size:17px;line-height:1.6;">${excerpt}</p>
      </td></tr>
      ${hero ? `<tr><td style="padding:30px 30px 0;">${hero}</td></tr>` : ''}
      <tr><td style="padding:32px 30px;color:#262626;font-size:16px;line-height:1.75;">${html}
        <p style="margin:32px 0 0;"><a href="${escapeHtml(articleUrl)}" style="display:inline-block;background:#f97316;color:#000000;font-size:14px;font-weight:bold;text-decoration:none;padding:14px 20px;">Read online &rarr;</a></p>
      </td></tr>
      <tr><td style="padding:24px 30px;border-top:1px solid #000000;background:#f4f4f4;color:#525252;font-size:13px;line-height:1.6;">
        <p style="margin:0 0 8px;color:#000000;font-weight:bold;">${brand}</p>
        <p style="margin:0 0 8px;">${escapeHtml(settings.location?.summary || '')}</p>
        ${socialHtml}
        <p style="margin:0;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#262626;text-decoration:underline;">Unsubscribe</a></p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`,
            headers: { 'List-Unsubscribe': `<${oneClickUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
          });
          sent++;
        } catch (error) {
          failed++;
          console.error('Newsletter email delivery failed:', error);
        }
        if (process.env.RESEND_API_KEY) await new Promise((resolve) => setTimeout(resolve, 550));
      }
      hasNextPage = subscribers.hasNextPage;
      lastId = subscribers.docs.at(-1)?.id;
    }
    return Response.json({ message: failed ? `Sent to ${sent} subscribers; ${failed} deliveries failed. Retrying sends to everyone again.` : `Sent to ${sent} subscribers.` }, { status: failed ? 207 : 200 });
  } catch (error) {
    console.error('Newsletter send failed:', error);
    return Response.json({ message: 'Unable to send the newsletter. Check delivery before retrying to avoid duplicates.' }, { status: 500 });
  }
}
