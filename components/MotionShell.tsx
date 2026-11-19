'use client';

import { MotionConfig, motion, useScroll } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export function MotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-primary motion-reduce:hidden"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.div
        key={pathname}
        className="w-full max-w-full overflow-x-clip"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
