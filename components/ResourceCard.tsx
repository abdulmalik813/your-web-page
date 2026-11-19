import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { ResourceEntry } from '@/lib/cms';
import { siteCardClass } from './siteStyles';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';

export function ResourceCard({ resource, index = 0 }: { resource: ResourceEntry; index?: number }) {
  return (
    <Reveal className="h-full" direction={revealDirectionForIndex(index)} interactive>
      <Link className="group block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/resources/${resource.slug}`}>
        <Card className={`${siteCardClass} flex h-full flex-col gap-4 p-4 transition-colors duration-300 group-hover:border-primary/50 md:p-5`}>
          <div className="relative flex aspect-[16/9] items-end justify-between overflow-hidden rounded-sm border border-border/50 bg-gradient-to-br from-secondary via-accent/70 to-primary/10 p-5">
            <div className="absolute inset-y-0 right-0 w-1/3 border-l border-primary/15 bg-primary/5 [background-image:linear-gradient(90deg,transparent_49%,var(--border)_50%,transparent_51%)] [background-size:18px_18px]" aria-hidden="true" />
            <div className="relative grid grid-cols-3 items-end gap-2" aria-hidden="true">
              <span className="h-10 w-3 bg-primary/35" />
              <span className="h-16 w-3 bg-primary/70" />
              <span className="h-12 w-3 bg-primary" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em]">
            <span className="text-primary">{resource.category}</span>
            <span className="font-medium text-muted-foreground">{resource.readTime} min read</span>
          </div>
          <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.03em] [overflow-wrap:anywhere]">{resource.title}</h3>
          <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{resource.excerpt}</p>
          <span className="break-words font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground">{resource.publishDate}</span>
          <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-foreground">Read <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" /></span>
        </Card>
      </Link>
    </Reveal>
  );
}
