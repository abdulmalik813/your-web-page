'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isPreviewPath, toPreviewPath } from '@/lib/preview-paths';

/** App routes that are not CMS pages and must keep their own URL. */
const APP_PREFIXES = ['/api', '/admin'];
const APP_PATHS = new Set([
  '/feed.xml',
  '/llms.txt',
  '/news-sitemap.xml',
  '/robots.txt',
  '/sitemap.xml',
  '/unsubscribe',
]);

function isAppPath(pathname: string): boolean {
  if (APP_PATHS.has(pathname)) return true;
  return APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Keeps same-origin page links inside /preview while a draft preview is open.
 * The listener runs in the capture phase, so preventDefault() is already set
 * when React and next/link handle the click; next/link then leaves the
 * navigation to the router call below.
 */
export function PreviewLinkGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const enabled = isPreviewPath(pathname);

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      const anchor = target instanceof Element ? target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download')) return;
      if (anchor.getAttribute('target')?.toLowerCase() === '_blank') return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (isPreviewPath(url.pathname) || isAppPath(url.pathname)) return;

      event.preventDefault();
      router.push(`${toPreviewPath(url.pathname)}${url.search}${url.hash}`);
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [enabled, router]);

  return null;
}
