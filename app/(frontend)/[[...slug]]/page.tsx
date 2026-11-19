import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { CtaBand } from '@/components/CtaBand';
import { Grid } from '@/components/Grid';
import { PageHeader } from '@/components/PageHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { ResourceCard } from '@/components/ResourceCard';
import { MediaFigure } from '@/components/MediaFigure';
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
import { RichText } from '@payloadcms/richtext-lexical/react';
import {
  getCmsFaqGroups,
  getCmsPage,
  getCmsProjectBySlug,
  getCmsProjects,
  getCmsResourceBySlug,
  getCmsResources,
  getCmsServiceBySlug,
  getCmsServices,
} from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

const pageSection = 'relative border-b border-border/50 bg-muted/10 py-12 md:py-24';
const pageContainer = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11';
const pageLabel = 'font-mono text-xs font-medium uppercase leading-5 tracking-[0.14em]';
const pageCell = `${siteCardClass} flex flex-col gap-4 p-6 md:p-8`;
const pageWrap = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11';
const pageTightSection = 'relative border-b border-border/50 bg-background py-12 md:py-24';

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = await getCmsPage(slug.join('/'));
  if (!page && slug.length === 2) {
    if (slug[0] === 'services') {
      const service = await getCmsServiceBySlug(slug[1]);
      if (service) return buildPageMetadata({
        title: service.meta?.title || service.title,
        description: service.meta?.description || service.metaDescription,
        path: `/services/${service.slug}`,
      });
    }
    if (slug[0] === 'our-work') {
      const project = await getCmsProjectBySlug(slug[1]);
      if (project) return buildPageMetadata({
        title: project.meta?.title || project.title,
        description: project.meta?.description || project.summary,
        path: `/our-work/${project.slug}`,
      });
    }
    if (slug[0] === 'resources') {
      const resource = await getCmsResourceBySlug(slug[1]);
      if (resource) return buildPageMetadata({
        title: resource.meta?.title || resource.title,
        description: resource.meta?.description || resource.excerpt,
        path: `/resources/${resource.slug}`,
        type: 'article',
      });
    }
  }
  if (!page) return {};
  const meta = page.meta as { title?: string; description?: string } | undefined;
  const hero = Array.isArray(page.layout)
    ? page.layout.find((block: { blockType?: string }) => block.blockType === 'hero')
    : undefined;
  return buildPageMetadata({
    title: meta?.title || page.title,
    description: meta?.description || hero?.lead || '',
    path: slug.length ? `/${slug.join('/')}` : '/',
  });
}

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

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const { isEnabled: draft } = await draftMode();
  const page = await getCmsPage(slug.join('/'), draft);
  if (!page) {
    if (slug.length === 2) {
      if (slug[0] === 'services') {
        const item = await getCmsServiceBySlug(slug[1], draft);
        if (item) {
          const all = await getCmsServices(draft);
          const related = all.filter((service) => service.slug !== item.slug).slice(0, 3);
          return (
            <>
              <PageHeader label="Service" title={item.title} lead={item.intro} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: item.title }]}>
                <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="h-12 rounded-sm bg-primary px-6 font-semibold text-primary-foreground"><Link href="/start-a-project">Start a project</Link></Button><Button asChild variant="outline" className="h-12 rounded-sm border-border bg-background px-6 font-semibold"><Link href="/contact">Ask a question</Link></Button></div>
              </PageHeader>
              {item.image ? <section className={pageSection}><div className={pageContainer}><MediaFigure image={item.image} alt={item.title} aspect="wide" sizes="(min-width: 1360px) 1280px, calc(100vw - 2rem)" /></div></section> : null}
              <section className={pageSection}><div className={pageContainer}><div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <Reveal className="h-full" direction="left"><Card className={pageCell}><span className={pageLabel}>Overview</span><h2 className="break-words text-[clamp(1.9rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-tight [overflow-wrap:anywhere]">How we approach {item.title.toLowerCase()}</h2></Card></Reveal>
                <Reveal className="h-full" direction="right"><Card className={`${pageCell} h-full max-w-[68ch] text-lg leading-[1.7]`}>{item.overview.map((text) => <p key={text}>{text}</p>)}</Card></Reveal>
              </div></div></section>
              <section className={pageSection}><div className={pageContainer}><Grid columns={3}>
                <Reveal className="h-full" direction="left"><Card className={pageCell}><span className={pageLabel}>What is included</span><ul className="list-none space-y-2.5">{item.included.map((text) => <li className="relative pl-6 before:absolute before:left-0 before:top-[0.68em] before:size-2 before:bg-primary before:content-['']" key={text}>{text}</li>)}</ul></Card></Reveal>
                <Reveal className="h-full" direction="up"><Card className={pageCell}><span className={pageLabel}>Who it is for</span><ul className="list-none space-y-2.5">{item.forWho.map((text) => <li className="relative pl-6 before:absolute before:left-0 before:top-[0.68em] before:size-2 before:bg-primary before:content-['']" key={text}>{text}</li>)}</ul></Card></Reveal>
                <Reveal className="h-full" direction="right"><Card className={pageCell}><span className={pageLabel}>How it works</span><ol className="[counter-reset:steps] space-y-3.5">{item.steps.map((step) => <li className="relative [counter-increment:steps] pl-11 before:absolute before:left-0 before:top-0 before:grid before:size-[30px] before:place-items-center before:bg-primary/10 before:font-mono before:text-[13px] before:font-bold before:text-primary before:content-[counter(steps)]" key={step.title}><b className="block font-semibold">{step.title}</b>{step.description}</li>)}</ol></Card></Reveal>
              </Grid></div></section>
              <section className={pageSection}><div className={pageContainer}><div className="mb-8 flex flex-wrap items-end justify-between gap-6"><div><span className={pageLabel}>Related</span><h2 className="mt-3 break-words text-[clamp(1.9rem,4.4vw,3.6rem)] font-black uppercase leading-[0.98] tracking-tight [overflow-wrap:anywhere]">Other services</h2></div></div><Grid columns={3}>{related.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}</Grid></div></section>
              <CtaBand />
            </>
          );
        }
      }
      if (slug[0] === 'our-work') {
        const item = await getCmsProjectBySlug(slug[1], draft);
        if (item) {
          const all = await getCmsProjects(draft);
          const more = all.filter((project) => project.slug !== item.slug).slice(0, 3);
          return (
            <>
              <PageHeader label="Project" title={item.title} lead={item.summary} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Our Work', href: '/our-work' }, { label: item.title}]} />
              {item.image ? <section className={pageSection}><div className={pageContainer}><MediaFigure image={item.image} alt={item.title} aspect="wide" sizes="(min-width: 1360px) 1280px, calc(100vw - 2rem)" /></div></section> : null}
              <section className={pageSection}><div className={pageContainer}><div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <Reveal className="h-full" direction="left"><Card className={pageCell}><dl className="m-0 grid gap-0">{[['Type', item.type], ['Our role', item.role], ['Built with', item.tags.join(', ')]].map(([label, value], index) => <div className={`border-t border-border py-4 ${index === 0 ? 'border-t-0 pt-0' : ''}`} key={label}><dt className={`${pageLabel} mb-1 text-muted-foreground`}>{label}</dt><dd className="m-0 break-words font-semibold [overflow-wrap:anywhere]">{value}</dd></div>)}</dl></Card></Reveal>
                <Reveal className="h-full" direction="right"><Card className={`${pageCell} max-w-[68ch] text-base leading-[1.7] [&_h2]:mb-[0.7em] [&_h2]:mt-[2.2em] [&_h2]:text-[clamp(1.4rem,2.6vw,2rem)] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2:first-child]:mt-0`}><h2>The challenge</h2><p>{item.challenge}</p><h2>The approach</h2><p>{item.approach}</p><h2>What it delivered</h2><ul className="mb-5 grid list-none gap-2.5">{item.outcomes.map((outcome) => <li className="relative pl-6 before:absolute before:left-0 before:top-[0.68em] before:size-[7px] before:bg-primary before:content-['']" key={outcome}>{outcome}</li>)}</ul></Card></Reveal>
              </div></div></section>
              <section className={pageSection}><div className={pageContainer}><Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6" direction="left"><div><span className={pageLabel}>Keep looking</span><h2 className="mt-2 font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium tracking-tight">More work</h2></div><Button asChild variant="outline" className="rounded-sm border-border bg-card"><Link href="/our-work">All work</Link></Button></Reveal><Grid columns={3}>{more.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</Grid></div></section>
              <CtaBand />
            </>
          );
        }
      }
      if (slug[0] === 'resources') {
        const item = await getCmsResourceBySlug(slug[1], draft);
        if (item) {
          const all = await getCmsResources(draft);
          const more = all.filter((resource) => resource.slug !== item.slug).slice(0, 3);
          return (
            <>
              <PageHeader label="Resource" title={item.title} lead={item.excerpt} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: item.title }]}>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground"><span>{item.publishDate}</span><span>{item.readTime} min read</span>{item.tags.length ? <span>{item.tags.join(' · ')}</span> : null}</div>
              </PageHeader>
              {item.image ? <section className={pageSection}><div className={pageContainer}><MediaFigure image={item.image} alt={item.title} aspect="wide" sizes="(min-width: 1360px) 1280px, calc(100vw - 2rem)" /></div></section> : null}
              <section className={pageSection}><div className={pageContainer}><Reveal className="max-w-[68ch] text-base leading-[1.75] [&_h2]:mb-[0.7em] [&_h2]:mt-[2.2em] [&_h2]:text-[clamp(1.4rem,2.6vw,2rem)] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.68em] [&_li]:before:size-[7px] [&_li]:before:bg-primary [&_li]:before:content-[''] [&_ul]:mb-5 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-2.5" direction="right"><article>{item.sections.map((section, index) => <div key={index}>{section.heading ? <h2>{section.heading}</h2> : null}{section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}{section.bullets?.length ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</div>)}</article></Reveal></div></section>
              <section className={pageSection}><div className={pageContainer}><Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6" direction="right"><div><span className={pageLabel}>Keep reading</span><h2 className="mt-2 font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium tracking-tight">More resources</h2></div><Button asChild variant="outline" className="rounded-sm border-border bg-card"><Link href="/resources">All resources</Link></Button></Reveal><Grid columns={3}>{more.map((resource, index) => <ResourceCard key={resource.slug} resource={resource} index={index} />)}</Grid></div></section>
              <CtaBand />
            </>
          );
        }
      }
    }
    return notFound();
  }

  const layout = Array.isArray(page.layout) ? page.layout : [];

  return (
    <>
      {layout.map((block: any, index: number) => {
        switch (block.blockType) {
          case 'hero': {
            const isHome = slug.length === 0;
            return (
              <section className="relative isolate overflow-hidden border-b border-border/60 bg-[radial-gradient(ellipse_at_76%_40%,var(--accent)_0%,transparent_38%),linear-gradient(135deg,var(--background),var(--muted)_55%,var(--background))]" key={block.id || index}>
                <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(var(--border)_0.7px,transparent_0.7px)] [background-size:24px_24px]" aria-hidden="true" />
                <div className="relative mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11">
                  <div className={`grid grid-cols-1 items-center gap-8 py-12 md:py-20 ${isHome ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10' : ''}`}>
                    <Reveal className="relative z-10 flex flex-col items-start gap-7" direction="left">
                      {block.eyebrow ? <p className="font-mono text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-primary">{block.eyebrow}</p> : null}
                      <h1 className="max-w-[13ch] break-words font-heading text-[clamp(3rem,7.5vw,7.3rem)] font-medium leading-[0.88] tracking-[-0.06em] [overflow-wrap:anywhere]">{block.title}{block.highlight ? <> <mark className="bg-transparent italic text-primary">{block.highlight}</mark></> : null}</h1>
                      {block.lead ? <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.7] text-muted-foreground">{block.lead}</p> : null}
                      <div className="flex flex-wrap gap-3">
                        {block.primaryHref ? <Button asChild className="group h-12 gap-3 rounded-sm bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><Link href={block.primaryHref}>{block.primaryLabel || 'Learn more'}<ArrowRight className="transition-transform group-hover:translate-x-1" size={15} aria-hidden="true" /></Link></Button> : null}
                        {block.secondaryHref ? <Button asChild variant="outline" className="h-12 rounded-sm border-border bg-background px-6 font-semibold transition-colors hover:bg-muted"><Link href={block.secondaryHref}>{block.secondaryLabel || 'View more'}</Link></Button> : null}
                      </div>
                    </Reveal>
                    {isHome ? <HeroScene /> : null}
                  </div>
                  {Array.isArray(block.facts) && block.facts.length > 0 ? <div className="grid border-t border-border/60 py-3 font-mono text-xs font-medium uppercase leading-5 tracking-[0.06em] md:grid-cols-3">{block.facts.map((fact: { id?: string; text: string }, factIndex: number) => <Reveal className={`m-0 break-words px-4 py-3 text-muted-foreground sm:px-6 lg:px-8 ${factIndex ? 'border-t border-border/60 md:border-l md:border-t-0' : ''}`} key={fact.id || fact.text} delay={factIndex * 0.04} direction={revealDirectionForIndex(factIndex)}>{fact.text}</Reveal>)}</div> : null}
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
            return <CtaBand key={block.id || index} title={block.title} text={block.text} />;
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
  if (block.source === 'resources') {
    const items = (await getCmsResources(draft)).slice(0, limit);
    return <section className={pageTightSection}><div className={pageWrap}>{heading}<Grid columns={3}>{items.map((item, index) => <ResourceCard key={item.slug} resource={item} index={index} />)}</Grid></div></section>;
  }
  if (block.source === 'faqs') {
    const groups = await getCmsFaqGroups(draft);
    return <section className={pageTightSection}><div className={pageWrap}>{heading}<div className="grid gap-10">{groups.map((group, index) => <div key={group.title}><Reveal delay={index * 0.04} direction={revealDirectionForIndex(index)}><h3 className="mb-5 font-heading text-[clamp(1.25rem,2.4vw,1.8rem)] font-medium">{group.title}</h3></Reveal><FaqAccordion items={group.items} /></div>)}</div></div></section>;
  }
  if (block.source === 'testimonials') return <TestimonialsSection draft={draft} />;
  return (
    <section className={pageTightSection}><div className={pageWrap}>{heading}<Grid columns={3}>{(block.cards || []).map((card: any, index: number) => (
      <Reveal className="h-full" delay={index * 0.04} direction={revealDirectionForIndex(index)} interactive key={card.id || card.title}>
        {card.href ? (
          <Link className="block h-full min-w-0 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={card.href}>
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
    ))}</Grid></div></section>
  );
}

async function FormBlock({ block }: { block: any }) {
  const form = typeof block.form === 'object' ? block.form : null;
  if (!form) return null;
  return (
    <section className={pageTightSection}><div className={pageWrap}><div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr]"><Card className={`${siteCardClass} h-full overflow-hidden p-0`}><PageHeader label={block.eyebrow || 'Form'} title={block.heading || form.title} lead={richTextToText(block.description)} className="h-full border-0 bg-transparent !py-6 md:!py-8" /></Card><PayloadForm form={form} direction="right" /></div></div></section>
  );
}
