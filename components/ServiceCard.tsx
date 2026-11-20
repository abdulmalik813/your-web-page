import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Service } from '@/lib/cms';
import { MediaFigure } from './MediaFigure';
import { cardImageHoverClass, siteCardClass, siteCardLiftClass } from './siteStyles';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal className="h-full" delay={index * 0.04} direction={revealDirectionForIndex(index)}>
      <Link className="group block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/services/${service.slug}`}>
        <Card className={`${siteCardClass} ${siteCardLiftClass} flex h-full flex-col gap-4 p-4 md:p-5`}>
          <MediaFigure image={service.image} alt={service.title} imageClassName={cardImageHoverClass} />
          <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.03em] transition-colors duration-200 group-hover:text-primary-strong [overflow-wrap:anywhere]">{service.title}</h3>
          <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{service.short}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-foreground transition-colors duration-200 group-hover:text-primary-strong">Learn more <ArrowRight className="transition-[translate] duration-200 motion-safe:group-hover:translate-x-1" size={13} strokeWidth={2.5} aria-hidden="true" /></span>
        </Card>
      </Link>
    </Reveal>
  );
}
