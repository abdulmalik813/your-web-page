'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Keeps the scroll-progress bar and scroll restoration without the motion
 * runtime. The progress bar is driven by CSS scroll-timeline, so hydrating it
 * does not repaint the page content (and the LCP element).
 *
 * The page transition replays on client-side navigation only. Tracking the
 * previous path during render means the first paint after a load or reload has
 * no animation class, keeping the transition off the LCP path entirely.
 */
export function MotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState(pathname);
  const [hasNavigated, setHasNavigated] = useState(false);

  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setHasNavigated(true);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        className="scroll-progress pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-primary motion-reduce:hidden"
      />
      <div key={pathname} className={`w-full max-w-full overflow-x-clip${hasNavigated ? ' page-enter' : ''}`}>
        {children}
      </div>
    </>
  );
}
