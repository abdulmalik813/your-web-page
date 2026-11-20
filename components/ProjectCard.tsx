import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Project } from '@/lib/cms';
import { cardImageHoverClass, siteCardClass, siteCardLiftClass } from './siteStyles';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';
import { MediaFigure } from './MediaFigure';

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <Reveal className="h-full" direction={revealDirectionForIndex(index)}>
      <Link className="group block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/our-work/${project.slug}`}>
        <Card className={`${siteCardClass} ${siteCardLiftClass} flex h-full flex-col gap-4 p-4 md:p-5`}>
          <MediaFigure image={project.image} alt={project.title} imageClassName={cardImageHoverClass} />
          <p className="font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-primary-strong">{project.type}</p>
          <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.03em] transition-colors duration-200 group-hover:text-primary-strong [overflow-wrap:anywhere]">{project.title}</h3>
          <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{project.summary}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-foreground transition-colors duration-200 group-hover:text-primary-strong">View project <ArrowRight className="transition-[translate] duration-200 motion-safe:group-hover:translate-x-1" size={13} strokeWidth={2.5} aria-hidden="true" /></span>
        </Card>
      </Link>
    </Reveal>
  );
}
