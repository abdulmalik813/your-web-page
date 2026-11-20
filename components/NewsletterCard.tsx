import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { NewsletterEntry } from '@/lib/cms';
import { cardImageHoverClass, siteCardClass, siteCardLiftClass } from './siteStyles';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';
import { MediaFigure } from './MediaFigure';

export function NewsletterCard({ newsletter, index = 0 }: { newsletter: NewsletterEntry; index?: number }) {
  return (
    <Reveal className="h-full" direction={revealDirectionForIndex(index)}>
      <Link className="group block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/newsletters/${newsletter.slug}`}>
        <Card className={`${siteCardClass} ${siteCardLiftClass} flex h-full flex-col gap-4 p-4 md:p-5`}>
          <MediaFigure image={newsletter.image} alt={newsletter.title} imageClassName={cardImageHoverClass} />
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em]">
            <span className="text-primary-strong">{newsletter.category}</span>
            <span className="font-medium text-muted-foreground">{newsletter.readTime} min read</span>
          </div>
          <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.03em] transition-colors duration-200 group-hover:text-primary-strong [overflow-wrap:anywhere]">{newsletter.title}</h3>
          <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{newsletter.excerpt}</p>
          <span className="break-words font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground">{newsletter.publishDate}</span>
          <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-foreground transition-colors duration-200 group-hover:text-primary-strong">Read <ArrowRight className="transition-[translate] duration-200 motion-safe:group-hover:translate-x-1" size={13} strokeWidth={2.5} aria-hidden="true" /></span>
        </Card>
      </Link>
    </Reveal>
  );
}
