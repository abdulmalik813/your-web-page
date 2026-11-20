/**
 * Media utilities — image size selection & cache-busting.
 *
 * Payload generates these named sizes on upload (see Media.ts):
 *   thumbnail  300w
 *   square     500x500
 *   small      600w
 *   medium     900w
 *   large      1400w
 *   xlarge     1920w
 *   og         1200x630 (crop center)
 */

import { getServerSideURL } from './get-url';

export type PayloadImageSize = 'thumbnail' | 'square' | 'small' | 'medium' | 'large' | 'xlarge' | 'og';

export interface PayloadMediaObject {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  updatedAt?: string | null;
  sizes?: Partial<Record<PayloadImageSize, { url?: string | null; width?: number | null; height?: number | null } | null>>;
}

/** Resolve the best URL for a given logical size, falling back to the original URL. */
export function resolveImageUrl(
  media: PayloadMediaObject | null | undefined,
  size: PayloadImageSize,
): string | null {
  if (!media) return null;
  const base = getServerSideURL();
  const sizeUrl = media.sizes?.[size]?.url;
  const raw = sizeUrl ?? media.url;
  if (!raw) return null;

  // Keep app-hosted media same-origin. Absolute loopback URLs can be left over
  // from an earlier dev origin (localhost vs. 127.0.0.1), so strip those too.
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const parsed = new URL(raw);
      const baseUrl = base ? new URL(base) : null;
      const isLoopback = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
      if ((baseUrl && parsed.origin === baseUrl.origin) || (process.env.NODE_ENV !== 'production' && isLoopback)) {
        return `${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // Fall through and keep the original URL if it cannot be parsed.
    }
    return raw;
  }
  if (raw.startsWith('/')) return raw;
  return base ? `${base}${raw}` : raw;
}

/**
 * Append an updatedAt cache-buster query param.
 * Uses the full ISO timestamp so the browser re-fetches after every save.
 */
export function withCacheBuster(url: string | null | undefined, updatedAt?: string | null): string | null {
  if (!url) return null;
  if (!updatedAt) return url;
  const tag = encodeURIComponent(updatedAt);
  return `${url}?v=${tag}`;
}

/**
 * Returns the best src + dimensions for a given display context.
 *
 * aspect: 'wide'  → use `large` (1400w) or fall back to `medium`
 * aspect: 'card'  → use `medium` (900w) or fall back to `small`
 * aspect: 'thumb' → use `thumbnail` (300w)
 * aspect: 'og'    → use `og` (1200x630)
 */
export function resolveMediaForDisplay(
  media: PayloadMediaObject | null | undefined,
  aspect: 'wide' | 'card' | 'thumb' | 'og' = 'card',
): { src: string | null; width?: number; height?: number; alt: string } {
  if (!media) return { src: null, alt: '' };

  const sizeMap: Record<typeof aspect, PayloadImageSize[]> = {
    wide:  ['large', 'medium', 'small'],
    card:  ['medium', 'small', 'thumbnail'],
    thumb: ['thumbnail', 'small'],
    og:    ['og', 'large', 'medium'],
  };

  const candidates = sizeMap[aspect];
  let url: string | null = null;
  let width: number | undefined;
  let height: number | undefined;

  for (const size of candidates) {
    const sizeData = media.sizes?.[size];
    if (sizeData?.url) {
      url = resolveImageUrl(media, size);
      width = sizeData.width ?? undefined;
      height = sizeData.height ?? undefined;
      break;
    }
  }

  if (!url) {
    url = resolveImageUrl(media, candidates[0]);
    width = media.width ?? undefined;
    height = media.height ?? undefined;
  }

  return {
    src: withCacheBuster(url, media.updatedAt),
    width,
    height,
    alt: media.alt ?? '',
  };
}
