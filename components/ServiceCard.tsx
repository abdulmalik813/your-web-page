import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Service } from '@/lib/cms';
import { siteCardClass } from './siteStyles';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal className="h-full" delay={index * 0.04} direction={revealDirectionForIndex(index)} interactive>
      <Link className="group block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/services/${service.slug}`}>
        <Card className={`${siteCardClass} flex h-full flex-col gap-4 p-4 transition-colors duration-300 group-hover:border-primary/50 md:p-5`}>
          <div className="relative flex aspect-[16/9] items-end overflow-hidden rounded-sm border border-border/50 bg-gradient-to-br from-accent via-muted to-primary/10 p-5">
            <div className="absolute inset-y-0 right-0 w-1/3 border-l border-primary/15 bg-primary/5 [background-image:linear-gradient(90deg,transparent_49%,var(--border)_50%,transparent_51%)] [background-size:18px_18px]" aria-hidden="true" />
            <span className="relative font-heading text-5xl font-medium leading-none tracking-[-0.06em] text-primary">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.03em] [overflow-wrap:anywhere]">{service.title}</h3>
          <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{service.short}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-foreground">Learn more <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" /></span>
        </Card>
      </Link>
    </Reveal>
  );
}
