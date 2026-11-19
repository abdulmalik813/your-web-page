'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { RevealDirection } from './revealDirections';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
  direction?: RevealDirection;
}

const hiddenOffsets: Record<RevealDirection, { x: number; y: number }> = {
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
  up: { x: 0, y: 22 },
  down: { x: 0, y: -22 },
  scale: { x: 0, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  interactive = false,
  direction = 'up',
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, ...hiddenOffsets[direction] }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
      whileHover={interactive && !reduceMotion ? { y: -4 } : undefined}
      viewport={{ once: false, amount: 0.16 }}
      transition={{ duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
