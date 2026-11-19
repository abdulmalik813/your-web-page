'use client';

import { Children, type ReactNode, useEffect, useRef, useState } from 'react';
import { calcFillerCount } from '@/lib/filters';
import { cn } from '@/lib/utils';

interface GridProps {
  columns: 2 | 3 | 4;
  fill?: boolean;
  children: ReactNode;
  className?: string;
}

export function Grid({ columns, fill = false, children, className = '' }: GridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fillerCount, setFillerCount] = useState(0);
  const childCount = Children.count(children);

  useEffect(() => {
    if (!fill) return;

    const updateFillers = () => {
      const el = ref.current;
      if (!el) return;
      const computed = getComputedStyle(el).gridTemplateColumns;
      const activeCols = computed
        ? computed.split(' ').filter(Boolean).length
        : 1;
      setFillerCount(calcFillerCount(childCount, activeCols));
    };

    const observer = new ResizeObserver(updateFillers);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener('resize', updateFillers);
    const frameId = requestAnimationFrame(updateFillers);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', updateFillers);
    };
  }, [fill, childCount]);

  const columnClasses =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div
      ref={ref}
      className={cn(
        'grid min-w-0 grid-cols-1 gap-5',
        columnClasses,
        className
      )}
    >
      {children}
      {fill &&
        Array.from({ length: fillerCount }).map((_, idx) => (
          <div
            key={`filler-${idx}`}
            className="min-h-[72px] rounded-sm border border-dashed border-border bg-muted/30 [background-image:repeating-linear-gradient(135deg,transparent_0_10px,var(--border)_10px_11px)]"
            aria-hidden="true"
          />
        ))}
    </div>
  );
}
