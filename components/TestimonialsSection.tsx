import { Card } from '@/components/ui/card';
import { getCmsApprovedTestimonials } from '@/lib/cms';
import { Grid } from './Grid';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';
import { siteCardClass } from './siteStyles';

export async function TestimonialsSection({ draft = false }: { draft?: boolean }) {
  const approved = await getCmsApprovedTestimonials(draft);
  if (!approved.length) return null;

  return (
    <section className="relative isolate overflow-hidden border-b border-border/50 bg-gradient-to-br from-muted/30 via-transparent to-accent/15 text-foreground" aria-labelledby="testimonials-heading">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 border-l border-primary/10 [background-image:linear-gradient(90deg,transparent_49%,var(--border)_50%,transparent_51%)] [background-size:24px_24px]" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1360px] px-4 py-12 sm:px-6 md:py-24 lg:px-11">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6" direction="left">
          <div>
            <span className="mb-3 block font-mono text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-primary">What clients say</span>
            <h2 id="testimonials-heading" className="break-words font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[0.98] tracking-[-0.045em] [overflow-wrap:anywhere]">In their words</h2>
          </div>
        </Reveal>
        <Grid columns={3}>
          {approved.map((item, index) => (
            <Reveal className="h-full" delay={index * 0.08} direction={revealDirectionForIndex(index)} interactive key={item.id}>
              <Card className={`${siteCardClass} flex h-full flex-col gap-5 p-6`}>
                <span className="grid size-11 place-items-center bg-primary/10 font-heading text-4xl leading-none text-primary" aria-hidden="true">“</span>
                <blockquote className="break-words font-heading text-xl leading-snug [overflow-wrap:anywhere]">{item.quote}</blockquote>
                <div className="mt-auto border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                  <b className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wide text-foreground">{item.authorName}</b>
                  {item.roleAndCompany}<br />{item.location}
                </div>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </div>
    </section>
  );
}
