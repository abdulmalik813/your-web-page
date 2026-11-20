import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { CtaBand } from '@/components/CtaBand';
import { Grid } from '@/components/Grid';
import { PageHeader } from '@/components/PageHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { NewsletterCard } from '@/components/NewsletterCard';
import { ServiceCard } from '@/components/ServiceCard';
import { WorkBrowser } from '@/components/WorkBrowser';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FaqAccordion } from '@/components/FaqAccordion';
import { PayloadForm } from '@/components/PayloadForm';
import { HeroScene } from '@/components/HeroScene';
import { Reveal } from '@/components/Reveal';
import { revealDirectionForIndex } from '@/components/revealDirections';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { siteCardClass } from '@/components/siteStyles';
import { getCmsFaqGroups, getCmsProjects, getCmsNewsletters, getCmsServices } from '@/lib/cms';
import { legacyCmsLink, legacyLink, resolveLink } from '@/lib/links';

const pageLabel = 'font-mono text-xs font-medium uppercase leading-5 tracking-[0.14em]';
const pageWrap = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11';
const pageTightSection = 'relative overflow-x-clip border-b border-border bg-transparent py-8 md:py-10 lg:py-14';

function richTextToText(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const root = (value as { root?: { children?: unknown[] } }).root;
  const walk = (node: unknown): string => {
    if (typeof node !== 'object' || node === null) return '';
    const n = node as { text?: unknown; children?: unknown[] };
    return typeof n.text === 'string'
      ? n.text
      : Array.isArray(n.children)
        ? n.children.map(walk).join('')
        : '';
  };
  return root?.children?.map(walk).join('\n') || '';
}

export function CmsPageLayout({ page, isHome, draft }: { page: any; isHome: boolean; draft: boolean }) {
  const layout = Array.isArray(page.layout) ? page.layout : [];

  return (
    <>
      {layout.map((block: any, index: number) => {
        switch (block.blockType) {
          case 'hero': {
            const primary = resolveLink(block.primaryLink) ?? legacyLink(block.primaryHref, block.primaryLabel);
            const secondary = resolveLink(block.secondaryLink) ?? legacyLink(block.secondaryHref, block.secondaryLabel);
            return (
              <section className="relative isolate overflow-x-clip border-b border-border bg-[radial-gradient(ellipse_at_76%_40%,var(--accent)_0%,transparent_42%),linear-gradient(135deg,transparent,var(--muted)/25_55%,transparent)]" key={block.id || index}>
                <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(var(--border)_0.7px,transparent_0.7px)] [background-size:24px_24px]" aria-hidden="true" />
                <div className="relative mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11">
                  <div className={`grid grid-cols-1 items-center gap-8 py-8 md:py-10 lg:py-14 ${isHome ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10' : ''}`}>
                    <Reveal className="relative z-10 flex flex-col items-start gap-7" direction="left">
                      {block.eyebrow ? <p className="font-mono text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-primary">{block.eyebrow}</p> : null}
                      <h1 className="max-w-[13ch] break-words font-heading text-[clamp(3rem,7.5vw,7.3rem)] font-medium leading-[0.88] tracking-[-0.06em] [overflow-wrap:anywhere]">{block.title}{block.highlight ? <> <mark className="bg-transparent italic text-primary">{block.highlight}</mark></> : null}</h1>
                      {block.lead ? <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.7] text-foreground font-medium">{block.lead}</p> : null}
                      <div className="flex flex-wrap gap-3">
                        {primary ? <Button asChild className="group h-12 gap-3 rounded-sm bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><Link href={primary.href} target={primary.newTab ? '_blank' : undefined} rel={primary.newTab ? 'noopener noreferrer' : undefined}>{primary.label}<ArrowRight className="transition-transform group-hover:translate-x-1" size={15} aria-hidden="true" /></Link></Button> : null}
                        {secondary ? <Button asChild variant="outline" className="h-12 rounded-sm border-border bg-background px-6 font-semibold transition-colors hover:bg-muted"><Link href={secondary.href} target={secondary.newTab ? '_blank' : undefined} rel={secondary.newTab ? 'noopener noreferrer' : undefined}>{secondary.label}</Link></Button> : null}
                      </div>
                    </Reveal>
                    {isHome ? <HeroScene /> : null}
                  </div>
                  {Array.isArray(block.facts) && block.facts.length > 0 ? <div className="grid border-t border-border py-3 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.06em] md:grid-cols-3">{block.facts.map((fact: { id?: string; text: string }, factIndex: number) => <Reveal className={`m-0 break-words px-4 py-3 text-foreground sm:px-6 lg:px-8 ${factIndex ? 'border-t border-border md:border-l md:border-t-0' : ''}`} key={fact.id || fact.text} delay={factIndex * 0.04} direction={revealDirectionForIndex(factIndex)}>{fact.text}</Reveal>)}</div> : null}
                </div>
              </section>
            );
          }
          case 'content':
            return (
              <section className={pageTightSection} key={block.id || index}>
                <div className={pageWrap}>
                  {block.eyebrow || block.heading ? <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6" direction="left"><div>{block.eyebrow ? <span className={pageLabel}>{block.eyebrow}</span> : null}{block.heading ? <h2 className="mt-3 break-words font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium leading-tight tracking-tight [overflow-wrap:anywhere]">{block.heading}</h2> : null}</div></Reveal> : null}
                  <Reveal direction="right"><div className="max-w-[68ch] text-base leading-[1.75] [&_h2]:mb-[0.7em] [&_h2]:mt-[2.2em] [&_h2]:font-heading [&_h2]:text-[clamp(1.6rem,2.6vw,2.3rem)] [&_h2]:font-medium [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.68em] [&_li]:before:size-[7px] [&_li]:before:bg-primary [&_li]:before:content-[''] [&_ul]:mb-5 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-2.5 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"><RichText data={block.content} /></div></Reveal>
                </div>
              </section>
            );
          case 'cta':
            return (
              <CtaBand
                key={block.id || index}
                title={block.title}
                text={block.text}
                primaryLink={block.primaryLink ?? legacyCmsLink(block.primaryHref, block.primaryLabel)}
                secondaryLink={block.secondaryLink ?? legacyCmsLink(block.secondaryHref, block.secondaryLabel)}
              />
            );
          case 'testimonials':
            return <TestimonialsSection key={block.id || index} draft={draft} />;
          case 'cardGrid':
            return <CardGrid key={block.id || index} block={block} draft={draft} />;
          case 'form':
            return <FormBlock key={block.id || index} block={block} />;
          case 'legal':
            return (
              <section className={pageTightSection} key={block.id || index}>
                <div className={pageWrap}><Reveal className="max-w-[68ch] text-base leading-[1.75] [&_h2]:mb-[0.7em] [&_h2]:mt-[2.2em] [&_h2]:font-heading [&_h2]:text-[clamp(1.6rem,2.6vw,2.3rem)] [&_h2]:font-medium [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.68em] [&_li]:before:size-[7px] [&_li]:before:bg-primary [&_li]:before:content-[''] [&_ul]:mb-5 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-2.5" direction="right">{(block.sections || []).map((section: any) => (
                  <div key={section.id || section.heading}><h2>{section.heading}</h2>{(section.paragraphs || []).map((row: any) => <p key={row.id}>{row.text}</p>)}{(section.bullets || []).length ? <ul>{section.bullets.map((row: any) => <li key={row.id}>{row.text}</li>)}</ul> : null}</div>
                ))}</Reveal></div>
              </section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

async function CardGrid({ block, draft }: { block: any; draft: boolean }) {
  const limit = Number(block.limit || 6);
  const heading = block.eyebrow || block.heading ? (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6" direction="left">
      <div>
        {block.eyebrow ? <span className={pageLabel}>{block.eyebrow}</span> : null}
        {block.heading ? <h2 className="mt-3 break-words font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium leading-tight tracking-[-0.04em] [overflow-wrap:anywhere]">{block.heading}</h2> : null}
      </div>
    </Reveal>
  ) : null;
  if (block.source === 'services') {
    const items = (await getCmsServices(draft)).slice(0, limit);
    return <section className={pageTightSection}><div className={pageWrap}>{heading}<Grid columns={3}>{items.map((item, index) => <ServiceCard key={item.slug} service={item} index={index} />)}</Grid></div></section>;
  }
  if (block.source === 'projects') {
    const items = (await getCmsProjects(draft)).slice(0, limit);
    if (limit > 3) return <section className={pageTightSection}><div className={pageWrap}>{heading}<WorkBrowser projects={items} /></div></section>;
    return <section className={pageTightSection}><div className={pageWrap}>{heading}<Grid columns={3}>{items.map((item, index) => <ProjectCard key={item.slug} project={item} index={index} />)}</Grid></div></section>;
  }
  if (block.source === 'newsletter') {
    const items = (await getCmsNewsletters(draft)).slice(0, limit);
    return <section className={pageTightSection}><div className={pageWrap}>{heading}<Grid columns={3}>{items.map((item, index) => <NewsletterCard key={item.slug} newsletter={item} index={index} />)}</Grid></div></section>;
  }
  if (block.source === 'faqs') {
    const groups = await getCmsFaqGroups(draft);
    return <section className={pageTightSection}><div className={pageWrap}>{heading}<div className="grid gap-10">{groups.map((group, index) => <div key={group.title}><Reveal delay={index * 0.04} direction={revealDirectionForIndex(index)}><h3 className="mb-5 font-heading text-[clamp(1.25rem,2.4vw,1.8rem)] font-medium">{group.title}</h3></Reveal><FaqAccordion items={group.items} /></div>)}</div></div></section>;
  }
  if (block.source === 'testimonials') return <TestimonialsSection draft={draft} />;
  return (
    <section className={pageTightSection}><div className={pageWrap}>{heading}<Grid columns={3}>{(block.cards || []).map((card: any, index: number) => {
      const link = resolveLink(card.link) ?? legacyLink(card.href, card.title);
      return (
      <Reveal className="h-full" delay={index * 0.04} direction={revealDirectionForIndex(index)} interactive key={card.id || card.title}>
        {link ? (
          <Link className="block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={link.href} target={link.newTab ? '_blank' : undefined} rel={link.newTab ? 'noopener noreferrer' : undefined}>
            <Card className={`${siteCardClass} flex h-full flex-col gap-4 p-6`}>
              <span className="font-mono text-xs font-semibold tracking-[0.04em] text-primary">{card.number}</span>
              <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-tight tracking-tight [overflow-wrap:anywhere]">{card.title}</h3>
              <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{card.description}</p>
            </Card>
          </Link>
        ) : (
          <Card className={`${siteCardClass} flex h-full flex-col gap-4 p-6`}>
            <span className="font-mono text-xs font-semibold tracking-[0.04em] text-primary">{card.number}</span>
            <h3 className="break-words font-heading text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-tight tracking-tight [overflow-wrap:anywhere]">{card.title}</h3>
            <p className="break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{card.description}</p>
          </Card>
        )}
      </Reveal>
      );
    })}</Grid></div></section>
  );
}

async function FormBlock({ block }: { block: any }) {
  const form = typeof block.form === 'object' ? block.form : null;
  if (!form) return null;
  return (
    <section className={pageTightSection}><div className={pageWrap}><div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr]"><Card className={`${siteCardClass} h-full overflow-hidden p-0`}><PageHeader label={block.eyebrow || 'Form'} title={block.heading || form.title} lead={richTextToText(block.description)} className="h-full border-0 bg-transparent !py-6 md:!py-8" /></Card><PayloadForm form={form} direction="right" /></div></div></section>
  );
}
