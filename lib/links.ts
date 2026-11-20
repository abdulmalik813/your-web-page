export interface CmsLink {
  /** Set on navigation/footer array items; the link value itself is nested here. */
  link?: CmsLink | null;
  label?: string | null;
  type?: 'internal' | 'external' | string | null;
  internal?: {
    relationTo?: string | null;
    value?: string | { slug?: string | null; title?: string | null } | null;
  } | null;
  url?: string | null;
  href?: string | null;
  newTab?: boolean | null;
}

export interface ResolvedLink {
  href: string;
  label: string;
  newTab: boolean;
}

const ROUTE_PREFIXES: Record<string, string> = {
  pages: '',
  services: '/services/',
  projects: '/our-work/',
  newsletter: '/newsletters/',
};

/** Accept site-relative paths, anchors, http(s), mailto and tel links only. */
export function safeHref(value: unknown): string | null {
  const href = typeof value === 'string' ? value.trim() : '';
  if (!href) return null;
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : null;
}

/** Link shape used before the shared link field existed. */
export function legacyLink(
  href?: string | null,
  label?: string | null,
  newTab?: boolean | null,
): ResolvedLink | null {
  const safe = safeHref(href);
  if (!safe) return null;
  return { href: safe, label: (label || '').trim() || safe, newTab: Boolean(newTab) };
}

export function legacyCmsLink(href?: string | null, label?: string | null): CmsLink | undefined {
  return href ? { type: 'external', url: href, label: label ?? '' } : undefined;
}

export function resolveLink(link?: CmsLink | null, fallbackLabel = ''): ResolvedLink | null {
  if (!link) return null;

  const direct = legacyLink(link.href, link.label, link.newTab);
  if (direct) return direct;

  if (link.type === 'external') {
    const href = safeHref(link.url);
    if (!href) return null;
    return { href, label: (link.label || '').trim() || fallbackLabel || href, newTab: Boolean(link.newTab) };
  }

  if (link.type !== 'internal') return null;

  const relationTo = link.internal?.relationTo;
  const value = link.internal?.value;
  if (!relationTo || !value || typeof value !== 'object') return null;

  const prefix = ROUTE_PREFIXES[relationTo];
  if (prefix === undefined) return null;

  const slug = typeof value.slug === 'string' ? value.slug.trim() : '';
  if (!slug) return null;

  const href = relationTo === 'pages' ? (slug === 'home' ? '/' : `/${slug}`) : `${prefix}${slug}`;
  const label =
    (link.label || '').trim() ||
    (typeof value.title === 'string' ? value.title.trim() : '') ||
    fallbackLabel ||
    href;

  return { href, label, newTab: Boolean(link.newTab) };
}

/** Navigation/footer items now store their link in a nested group; older items stored it inline. */
export function resolveItemLink(item?: CmsLink | null): ResolvedLink | null {
  if (!item) return null;
  return resolveLink(item.link ?? item, item.label ?? '');
}
