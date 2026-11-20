'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PayloadAdminBarClient } from './PayloadAdminBarClient';

/**
 * Rendered by AdminBarGate after first interaction. The session endpoint is
 * the only source of the signed preview URL, so static HTML never carries a
 * preview secret or admin-specific markup.
 */
export function PublicAdminBar() {
  const pathname = usePathname() || '/';
  const [previewHref, setPreviewHref] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/admin/session?path=${encodeURIComponent(pathname)}`, {
      cache: 'no-store',
      credentials: 'same-origin',
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled) {
          setPreviewHref(typeof data?.previewHref === 'string' ? data.previewHref : null);
        }
      })
      .catch(() => {
        /* Signed-out visitors are expected to fail this check. */
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!previewHref) return null;

  return <PayloadAdminBarClient adminUrl="" draftEnabled={false} previewHref={previewHref} />;
}
