import type { Payload } from 'payload';
import type { Newsletter, Setting } from '@/payload-types';
import { getSocialLinks } from '@/data/company';
import { escapeHtml, safeUrl } from './html';
import { renderNewsletterContent } from './content';

type CreateNewsletterEmailArgs = {
  base: string;
  newsletter: Newsletter;
  payload: Payload;
  settings: Setting;
};

type NewsletterEmailParts = {
  articleUrl: string;
  base: string;
  brand: string;
  contentHtml: string;
  excerpt: string;
  hero: string;
  location: string;
  publishDate: string;
  socialHtml: string;
  title: string;
  wordmark: string;
};

export class NewsletterEmail {
  private constructor(private readonly parts: NewsletterEmailParts) {}

  static async create({
    base,
    newsletter,
    payload,
    settings,
  }: CreateNewsletterEmailArgs): Promise<NewsletterEmail> {
    const articleUrl = `${base}/newsletters/${encodeURIComponent(newsletter.slug)}`;
    const contentHtml = await renderNewsletterContent({
      articleUrl,
      base,
      newsletter,
      payload,
    });
    const socialLinks = getSocialLinks(settings.social);
    const socialHtml = socialLinks.length
      ? `<p style="margin:0 0 8px;">${socialLinks
          .map(
            ({ label, href }) =>
              `<a href="${escapeHtml(href)}" style="color:#262626;text-decoration:underline;">${escapeHtml(label)}</a>`,
          )
          .join(' &nbsp; · &nbsp; ')}</p>`
      : '';
    const hero =
      typeof newsletter.image === 'object' && newsletter.image?.url
        ? `<img src="${escapeHtml(safeUrl(newsletter.image.url, base))}" alt="${escapeHtml(newsletter.image.alt || newsletter.title)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />`
        : '';

    return new NewsletterEmail({
      articleUrl,
      base,
      brand: escapeHtml(settings.brand),
      contentHtml,
      excerpt: escapeHtml(newsletter.excerpt),
      hero,
      location: escapeHtml(settings.location?.summary || ''),
      publishDate: escapeHtml(newsletter.publishDate),
      socialHtml,
      title: escapeHtml(newsletter.title),
      wordmark: escapeHtml(settings.shortMark || settings.brand),
    });
  }

  render(unsubscribeUrl: string): string {
    const {
      articleUrl,
      base,
      brand,
      contentHtml,
      excerpt,
      hero,
      location,
      publishDate,
      socialHtml,
      title,
      wordmark,
    } = this.parts;

    return `<!doctype html>
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
      <tr><td style="padding:32px 30px;color:#262626;font-size:16px;line-height:1.75;">${contentHtml}
        <p style="margin:32px 0 0;"><a href="${escapeHtml(articleUrl)}" style="display:inline-block;background:#f97316;color:#000000;font-size:14px;font-weight:bold;text-decoration:none;padding:14px 20px;">Read online &rarr;</a></p>
      </td></tr>
      <tr><td style="padding:24px 30px;border-top:1px solid #000000;background:#f4f4f4;color:#525252;font-size:13px;line-height:1.6;">
        <p style="margin:0 0 8px;color:#000000;font-weight:bold;">${brand}</p>
        <p style="margin:0 0 8px;">${location}</p>
        ${socialHtml}
        <p style="margin:0;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#262626;text-decoration:underline;">Unsubscribe</a></p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
  }
}
