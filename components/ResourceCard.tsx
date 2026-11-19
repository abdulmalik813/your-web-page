import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { ResourceEntry } from '@/lib/cms';
import { siteCardClass } from './siteStyles';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';
import { MediaFigure } from './MediaFigure';

export function ResourceCard({ resource, index = 0 }: { resource: ResourceEntry; index?: number }) {
  return (
    <Reveal className="h-full" direction={revealDirectionForIndex(index)} interactive>
      <Link className="group block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/resources/${resource.slug}`}>
        <Card className={`${siteCardClass} flex h-full flex-col gap-4 p-4 transition-colors duration-300 group-hover:border-primary/50 md:p-5`}>
          <MediaFigure image={resource.image} alt={resource.title} />
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
