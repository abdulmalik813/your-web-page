import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { PatternVariant, Project } from '@/lib/cms';
import { siteCardClass } from './siteStyles';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';

const patternClasses: Record<PatternVariant, string> = {
  p1: 'bg-accent [background-image:radial-gradient(var(--o)_1.5px,transparent_1.5px)] [background-size:16px_16px]',
  p2: 'bg-secondary [background-image:repeating-linear-gradient(135deg,transparent_0_8px,var(--primary)_8px_10px)]',
  p3: 'bg-accent [background-image:linear-gradient(var(--signal)_1px,transparent_1px),linear-gradient(90deg,var(--signal)_1px,transparent_1px)] [background-size:24px_24px]',
  p4: 'bg-secondary [background-image:conic-gradient(var(--primary)_25%,var(--signal)_0_50%,var(--o)_0_75%,var(--accent)_0)] [background-size:32px_32px]',
  p5: 'bg-accent [background-image:repeating-linear-gradient(0deg,var(--o)_0_2px,transparent_2px_8px)]',
  p6: 'bg-secondary [background-image:repeating-linear-gradient(90deg,var(--signal)_0_3px,transparent_3px_10px)]',
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <Reveal className="h-full" direction={revealDirectionForIndex(index)} interactive>
      <Link className="group block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/our-work/${project.slug}`}>
        <Card className={`${siteCardClass} flex h-full flex-col gap-4 p-4 transition-colors duration-300 group-hover:border-primary/50 md:p-5`}>
          <div className={`group relative aspect-[16/10] w-full overflow-hidden rounded-sm ${patternClasses[project.pattern]}`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-foreground/10 via-transparent to-white/20 transition-transform duration-300 group-hover:scale-105" />
          </div>
          <p className="font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-primary">{project.type}</p>
          <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.03em] [overflow-wrap:anywhere]">{project.title}</h3>
          <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{project.summary}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-foreground">View project <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" /></span>
        </Card>
      </Link>
    </Reveal>
  );
}
