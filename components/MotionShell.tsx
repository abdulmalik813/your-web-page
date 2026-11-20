'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

/**
 * Keeps the scroll-progress bar and scroll restoration without the motion
 * runtime. The progress bar is driven by CSS scroll-timeline, so hydrating it
 * does not repaint the page content (and the LCP element).
 */
export function MotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        className="scroll-progress pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-primary motion-reduce:hidden"
      />
      <div key={pathname} className="w-full max-w-full overflow-x-clip">
        {children}
      </div>
    </>
  );
}
