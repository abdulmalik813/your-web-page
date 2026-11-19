'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { RevealDirection } from './revealDirections';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
  direction?: RevealDirection;
  once?: boolean;
}

const desktopOffsets: Record<RevealDirection, { x: number; y: number; scale?: number }> = {
  left: { x: -22, y: 0 },
  right: { x: 22, y: 0 },
  up: { x: 0, y: 20 },
  down: { x: 0, y: -20 },
  scale: { x: 0, y: 0, scale: 0.96 },
};

const mobileOffsets: Record<RevealDirection, { x: number; y: number; scale?: number }> = {
  left: { x: 0, y: 16 },
  right: { x: 0, y: 16 },
  up: { x: 0, y: 16 },
  down: { x: 0, y: -16 },
  scale: { x: 0, y: 0, scale: 0.97 },
};

const subscribeMedia = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

const getClientSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;

const getServerSnapshot = () => false;

export function Reveal({
  children,
  className,
  delay = 0,
  interactive = false,
  direction = 'up',
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useSyncExternalStore(subscribeMedia, getClientSnapshot, getServerSnapshot);

  const offset = isDesktop ? desktopOffsets[direction] : mobileOffsets[direction];

  return (
    <motion.div
      className={cn('max-w-full', className)}
      initial={reduceMotion ? false : { opacity: 0, ...offset }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 }}
      whileHover={interactive && !reduceMotion ? { y: -4 } : undefined}
      viewport={{ once, amount: 0.12 }}
      transition={{ duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
