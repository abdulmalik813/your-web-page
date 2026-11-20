import type { CSSProperties, ReactNode } from 'react';
import type { RevealDirection } from './revealDirections';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
  direction?: RevealDirection;
  once?: boolean;
  /**
   * Above-the-fold content should stay static: animating it after hydration
   * repaints the LCP element and pushes Lighthouse's LCP estimate to ~4s.
   */
  animate?: boolean;
}

const desktopOffsets: Record<RevealDirection, { x: number; y: number }> = {
  left: { x: -22, y: 0 },
  right: { x: 22, y: 0 },
  up: { x: 0, y: 20 },
  down: { x: 0, y: -20 },
  scale: { x: 0, y: 0 },
};

const mobileY: Record<RevealDirection, number> = {
  left: 16,
  right: 16,
  up: 16,
  down: -16,
  scale: 0,
};

/**
 * CSS scroll-driven reveal. No client JS: the browser animates the element as
 * it enters the viewport, and browsers without view-timeline support simply
 * show the final state.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  interactive = false,
  direction = 'up',
  animate = true,
}: RevealProps) {
  const offset = desktopOffsets[direction];

  return (
    <div
      className={cn('max-w-full', animate && 'reveal', interactive && 'reveal-interactive', className)}
      data-reveal-mobile-y={mobileY[direction]}
      style={
        animate
          ? ({
              '--reveal-delay': `${delay}s`,
              '--reveal-x': `${offset.x}px`,
              '--reveal-y': `${offset.y}px`,
            } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
