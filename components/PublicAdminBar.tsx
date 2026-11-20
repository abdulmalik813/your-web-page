'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isPreviewPath, toPublicPath } from '@/lib/preview-paths';
import { PayloadAdminBarClient } from './PayloadAdminBarClient';

/**
 * Rendered by AdminBarGate after first interaction, or immediately on preview
 * pages. The session endpoint is the only source of the signed preview URL,
 * so static HTML never carries a preview secret or admin-specific markup.
 */
export function PublicAdminBar() {
  const pathname = usePathname() || '/';
  const isPreview = isPreviewPath(pathname);
  const publicPath = toPublicPath(pathname);
  const [previewHref, setPreviewHref] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    fetch(`/api/admin/session?path=${encodeURIComponent(publicPath)}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled) {
          setPreviewHref(typeof data?.previewHref === 'string' ? data.previewHref : null);
        }
      })
      .catch(() => {
        /* Signed-out visitors and aborted navigations are expected to fail. */
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [publicPath]);

  if (!previewHref) return null;

  return <PayloadAdminBarClient adminUrl="" draftEnabled={isPreview} previewHref={previewHref} />;
}
