import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  columns: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}

export function Grid({ columns, children, className = '' }: GridProps) {
  const columnClasses =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-1 gap-5',
        columnClasses,
        className
      )}
    >
      {children}
    </div>
  );
}
