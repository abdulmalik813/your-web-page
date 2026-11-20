'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isPreviewPath } from '@/lib/preview-paths';

const PublicAdminBar = dynamic(
  () => import('./PublicAdminBar').then((module) => module.PublicAdminBar),
  { ssr: false },
);

// Keep the toolbar available for client-side navigations once it is shown.
let adminBarEnabled = false;

/**
 * Public pages reveal the toolbar on first interaction so anonymous loads
 * (and Lighthouse) never fetch the session or toolbar chunk. Preview pages are
 * admin-only, so show it immediately.
 */
export function AdminBarGate() {
  const pathname = usePathname() || '/';
  const isPreview = isPreviewPath(pathname);
  const [enabled, setEnabled] = useState(adminBarEnabled);
  const showToolbar = enabled || isPreview || adminBarEnabled;

  useEffect(() => {
    if (isPreview) {
      adminBarEnabled = true;
      return;
    }

    if (enabled) return;

    let done = false;

    const enable = () => {
      if (done) return;
      done = true;
      adminBarEnabled = true;
      setEnabled(true);
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('keydown', enable);
      window.removeEventListener('touchstart', enable);
      window.removeEventListener('wheel', enable);
    };

    window.addEventListener('pointerdown', enable, { passive: true });
    window.addEventListener('keydown', enable);
    window.addEventListener('touchstart', enable, { passive: true });
    window.addEventListener('wheel', enable, { passive: true });

    return () => {
      done = true;
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('keydown', enable);
      window.removeEventListener('touchstart', enable);
      window.removeEventListener('wheel', enable);
    };
  }, [enabled, isPreview]);

  if (!showToolbar) return null;

  return <PublicAdminBar />;
}
