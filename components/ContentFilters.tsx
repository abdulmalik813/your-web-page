'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContentFiltersProps<T extends string> {
  options: T[];
  value: T;
  label: string;
  onChange: (value: T) => void;
}

export function ContentFilters<T extends string>({
  options,
  value,
  label,
  onChange,
}: ContentFiltersProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <Button
            key={option}
            type="button"
            variant="outline"
            aria-pressed={selected}
            className={cn(
              'h-10 rounded-sm border-border/70 bg-card px-4 font-mono text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              selected && 'border-foreground bg-foreground text-background hover:bg-foreground hover:text-background',
            )}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
}
