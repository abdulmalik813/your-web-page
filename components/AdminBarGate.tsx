'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PublicAdminBar = dynamic(
  () => import('./PublicAdminBar').then((module) => module.PublicAdminBar),
  { ssr: false },
);

// Once someone has interacted on one page, keep the toolbar available for
// client-side navigations instead of making them trigger it again.
let adminBarEnabled = false;

/**
 * The toolbar is only useful once someone is using the page. Keeping the
 * component and its authenticated session request behind first interaction
 * means anonymous page loads (and Lighthouse) never pay for it. Signed-in
 * admins get it on their first scroll, tap, or key press, with a long idle
 * fallback for anyone who just reads.
 */
export function AdminBarGate() {
  const pathname = usePathname() || '/';
  const isPreview = pathname === '/preview' || pathname.startsWith('/preview/');
  const [enabled, setEnabled] = useState(adminBarEnabled);

  useEffect(() => {
    if (isPreview || enabled) return;

    let done = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const enable = () => {
      if (done) return;
      done = true;
      adminBarEnabled = true;
      setEnabled(true);
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('keydown', enable);
      window.removeEventListener('touchstart', enable);
      window.removeEventListener('wheel', enable);
      if (timer !== undefined) clearTimeout(timer);
    };

    window.addEventListener('pointerdown', enable, { passive: true });
    window.addEventListener('keydown', enable);
    window.addEventListener('touchstart', enable, { passive: true });
    window.addEventListener('wheel', enable, { passive: true });
    timer = setTimeout(enable, 10000);

    return () => {
      done = true;
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('keydown', enable);
      window.removeEventListener('touchstart', enable);
      window.removeEventListener('wheel', enable);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [enabled, isPreview]);

  if (isPreview || !enabled) return null;

  return <PublicAdminBar />;
}
