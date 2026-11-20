import {
  getCmsNewsletters,
  getCmsPages,
  getCmsProjects,
  getCmsServices,
  getCmsSettings,
} from '@/lib/cms';
import { getBaseUrl } from '@/lib/seo';

const clean = (value: unknown): string =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';

const oneLine = (value: unknown, max = 220): string => {
  const text = clean(value);
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};

const label = (value: unknown): string => oneLine(value).replace(/[[\]]/g, '');

function entry(title: string, path: string, note?: string): string {
  const suffix = note ? `: ${note}` : '';
  return `- [${label(title)}](${path})${suffix}`;
}

/**
 * Builds the /llms.txt body: a compact, plain-text map of the site for AI
 * assistants, generated from the same CMS data as the sitemap.
 */
export async function buildLlmsTxt(): Promise<string> {
  const base = getBaseUrl();
  const [settings, pages, services, projects, newsletters] = await Promise.all([
    getCmsSettings(),
    getCmsPages(),
    getCmsServices(),
    getCmsProjects(),
    getCmsNewsletters(),
  ]);

  const brand = clean(settings?.brand) || 'Your Web Page';
  const description = clean(settings?.meta?.description);
  const city = clean(settings?.location?.city);
  const province = clean(settings?.location?.province);
  const country = clean(settings?.location?.country);
  const locationSummary = oneLine(settings?.location?.summary, 320);
  const email = clean(settings?.email);
  const phone = clean(settings?.phone);

  const place = [city, province, country].filter(Boolean).join(', ');
  const contact = [email, phone].filter(Boolean).join(' · ');

  const lines: string[] = [`# ${brand}`, ''];

  if (description) lines.push(`> ${description}`, '');

  if (locationSummary) lines.push(locationSummary, '');

  if (place || contact) {
    lines.push(
      [place ? `Based in ${place}.` : '', contact ? `Contact: ${contact}.` : '']
        .filter(Boolean)
        .join(' '),
      '',
    );
  }

  if (services.length) {
    lines.push('## Services', '');
    for (const service of services) {
      lines.push(entry(service.title, `${base}/services/${service.slug}`, oneLine(service.short)));
    }
    lines.push('');
  }

  if (projects.length) {
    lines.push('## Selected work', '');
    for (const project of projects) {
      const note = [project.type, oneLine(project.summary)].filter(Boolean).join(' — ');
      lines.push(entry(project.title, `${base}/our-work/${project.slug}`, note));
    }
    lines.push('');
  }

  const latest = [...newsletters].slice(0, 20);
  if (latest.length) {
    lines.push('## Latest newsletters', '');
    for (const item of latest) {
      const date = new Date(item.isoDate);
      const when = Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
          });
      const note = [item.category, when, oneLine(item.excerpt)].filter(Boolean).join(' — ');
      lines.push(entry(item.title, `${base}/newsletters/${item.slug}`, note));
    }
    lines.push('');
  }

  const pageNotes: Record<string, string> = {
    about: 'The studio, the people and how we work.',
    services: 'Design, development, ecommerce, custom software and care plans.',
    'our-work': 'Selected websites, online stores and software.',
    process: 'How projects run from first call to launch.',
    'where-we-work': 'Who we work with and where.',
    testimonials: 'What clients say about working together.',
    faq: 'Answers about scope, timelines, pricing and support.',
    contact: 'Start a project or ask a question.',
    privacy: 'Privacy policy.',
    terms: 'Terms of service.',
    newsletters: 'Every published newsletter, newest first.',
  };

  const listed = (pages as any[])
    .filter((page) => typeof page?.slug === 'string' && page.slug !== 'home')
    .map((page) => ({
      slug: page.slug as string,
      title: clean(page.title) || page.slug,
    }));

  if (listed.length) {
    lines.push('## Pages', '');
    for (const page of listed) {
      lines.push(entry(page.title, `${base}/${page.slug}`, pageNotes[page.slug]));
    }
    lines.push('');
  }

  lines.push(
    '## Machine-readable',
    '',
    entry('Sitemap', `${base}/sitemap.xml`, 'every indexable URL'),
    entry('News sitemap', `${base}/news-sitemap.xml`, 'articles from the last 48 hours'),
    entry('RSS feed', `${base}/feed.xml`, 'latest newsletters'),
    '',
  );

  return `${lines.join('\n').trim()}\n`;
}
