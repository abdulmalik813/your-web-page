import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react';
import { CtaBand } from '@/components/CtaBand';
import { Grid } from '@/components/Grid';
import { PageHeader } from '@/components/PageHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { NewsletterCard } from '@/components/NewsletterCard';
import { NewsletterMediaBlock } from '@/components/NewsletterMediaBlock';
import { NewsletterLinkBlock } from '@/components/NewsletterLinkBlock';
import { MediaFigure } from '@/components/MediaFigure';
import { ServiceCard } from '@/components/ServiceCard';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { siteCardClass } from '@/components/siteStyles';
import { getCmsServiceBySlug, getCmsServices, getCmsProjectBySlug, getCmsProjects, getCmsNewsletterBySlug, getCmsNewsletters, getCmsSettings } from '@/lib/cms';
import { legacyLink, resolveLink } from '@/lib/links';
import { JsonLd } from '@/components/JsonLd';
import { articleNode, breadcrumbNode, projectNode, serviceNode, webPageNode } from '@/lib/schema';

const pageSection = 'relative overflow-x-clip border-b border-border bg-muted/20 py-8 md:py-10 lg:py-14';
const pageContainer = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11';
const pageLabel = 'font-mono text-xs font-medium uppercase leading-5 tracking-[0.14em]';
const pageCell = `${siteCardClass} flex flex-col gap-4 p-6 md:p-8`;

const newsletterConverters = {
  ...defaultJSXConverters,
  upload: ({ node }: any) => (
    <NewsletterMediaBlock
      image={node.value}
      caption={node.fields?.caption}
      size={node.fields?.size}
    />
  ),
  blocks: {
    mediaBlock: ({ node }: any) => (
      <NewsletterMediaBlock
        image={node.fields?.image}
        caption={node.fields?.caption}
        size={node.fields?.size}
      />
    ),
    linkBlock: ({ node }: any) => {
      const fields = node.fields ?? {};
      const link = resolveLink(fields.link) ?? legacyLink(fields.href, fields.label, fields.newTab);
      if (!link) return null;
      return (
        <NewsletterLinkBlock
          label={link.label}
          href={link.href}
          style={fields.style}
          newTab={link.newTab}
        />
      );
    },
  },
};

export async function DetailPage({ slug, draft }: { slug: string[]; draft: boolean }) {
    const settings = await getCmsSettings(draft);
    if (slug.length === 2) {
      if (slug[0] === 'services') {
        const item = await getCmsServiceBySlug(slug[1], draft);
        if (item) {
          const all = await getCmsServices(draft);
          const related = all.filter((service) => service.slug !== item.slug).slice(0, 3);
          const servicePath = `/services/${item.slug}`;
          const serviceCrumbs = [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: item.title }];
          return (
            <>
              <JsonLd
                nodes={[
                  webPageNode({ path: servicePath, title: item.title, description: item.metaDescription }),
                  breadcrumbNode(serviceCrumbs, servicePath),
                  serviceNode(item, servicePath),
                ]}
              />
              <PageHeader label="Service" title={item.title} lead={item.intro} breadcrumbs={serviceCrumbs}>
                <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="h-12 rounded-sm bg-primary px-6 font-semibold text-primary-foreground"><Link href="/contact">Start a project</Link></Button></div>
              </PageHeader>
              {item.image ? <section className={pageSection}><div className={pageContainer}><MediaFigure image={item.image} alt={item.title} aspect="wide" sizes="(min-width: 1360px) 1280px, calc(100vw - 2rem)" /></div></section> : null}
              <section className={pageSection}><div className={pageContainer}><div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <Reveal className="h-full" direction="left"><Card className={pageCell}><span className={pageLabel}>Overview</span><h2 className="break-words text-[clamp(1.9rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-tight [overflow-wrap:anywhere]">How we approach {item.title.toLowerCase()}</h2></Card></Reveal>
                <Reveal className="h-full" direction="right"><Card className={`${pageCell} h-full max-w-[68ch] text-lg leading-[1.7]`}>{item.overview.map((text) => <p key={text}>{text}</p>)}</Card></Reveal>
              </div></div></section>
              <section className={pageSection}><div className={pageContainer}><Grid columns={3}>
                <Reveal className="h-full" direction="left"><Card className={pageCell}><span className={pageLabel}>What is included</span><ul className="list-none space-y-2.5">{item.included.map((text) => <li className="relative pl-6 before:absolute before:left-0 before:top-[0.68em] before:size-2 before:bg-primary before:content-['']" key={text}>{text}</li>)}</ul></Card></Reveal>
                <Reveal className="h-full" direction="up"><Card className={pageCell}><span className={pageLabel}>Who it is for</span><ul className="list-none space-y-2.5">{item.forWho.map((text) => <li className="relative pl-6 before:absolute before:left-0 before:top-[0.68em] before:size-2 before:bg-primary before:content-['']" key={text}>{text}</li>)}</ul></Card></Reveal>
                <Reveal className="h-full" direction="right"><Card className={pageCell}><span className={pageLabel}>How it works</span><ol className="[counter-reset:steps] space-y-3.5">{item.steps.map((step) => <li className="relative [counter-increment:steps] pl-11 before:absolute before:left-0 before:top-0 before:grid before:size-[30px] before:place-items-center before:bg-primary/10 before:font-mono before:text-[13px] before:font-bold before:text-primary-strong before:content-[counter(steps)]" key={step.title}><b className="block font-semibold">{step.title}</b>{step.description}</li>)}</ol></Card></Reveal>
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
                    const projectPath = `/our-work/${item.slug}`;
          const projectCrumbs = [{ label: 'Home', href: '/' }, { label: 'Our Work', href: '/our-work' }, { label: item.title }];
          return (
            <>
              <JsonLd
                nodes={[
                  webPageNode({ path: projectPath, title: item.title, description: item.summary }),
                  breadcrumbNode(projectCrumbs, projectPath),
                  projectNode(item, projectPath),
                ]}
              />
              <PageHeader label="Project" title={item.title} lead={item.summary} breadcrumbs={projectCrumbs} />
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
      if (slug[0] === 'newsletters') {
        const item = await getCmsNewsletterBySlug(slug[1], draft);
        if (item) {
          const all = await getCmsNewsletters(draft);
          const more = all.filter((entry) => entry.slug !== item.slug).slice(0, 3);
          const articlePath = `/newsletters/${item.slug}`;
          const articleCrumbs = [{ label: 'Home', href: '/' }, { label: 'Newsletters', href: '/newsletters' }, { label: item.title }];
          return (
            <>
              <JsonLd
                nodes={[
                  webPageNode({
                    path: articlePath,
                    title: item.title,
                    description: item.excerpt,
                    datePublished: new Date(`${item.isoDate}T09:00:00-04:00`).toISOString(),
                    dateModified: item.updatedAt,
                  }),
                  breadcrumbNode(articleCrumbs, articlePath),
                  articleNode({ entry: item, settings, path: articlePath }),
                ]}
              />
              <PageHeader label="Newsletter" title={item.title} lead={item.excerpt} breadcrumbs={articleCrumbs}>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground"><span>{item.publishDate}</span><span>{item.readTime} min read</span>{item.tags.length ? <span>{item.tags.join(' · ')}</span> : null}</div>
              </PageHeader>
              {item.image ? <section className={pageSection}><div className={pageContainer}><MediaFigure image={item.image} alt={item.title} aspect="wide" sizes="(min-width: 1360px) 1280px, calc(100vw - 2rem)" /></div></section> : null}
              <section className={pageSection}><div className={pageContainer}><Reveal className="max-w-[68ch] text-base leading-[1.75] [&_h2]:mb-[0.7em] [&_h2]:mt-[2.2em] [&_h2]:text-[clamp(1.4rem,2.6vw,2rem)] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_p]:mb-4 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.68em] [&_li]:before:size-[7px] [&_li]:before:bg-primary [&_li]:before:content-[''] [&_ul]:mb-5 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-2.5" direction="right"><article>{item.content ? <RichText data={item.content as any} converters={newsletterConverters as any} /> : null}</article></Reveal></div></section>
              <section className={pageSection}><div className={pageContainer}><Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6" direction="right"><div><span className={pageLabel}>Keep reading</span><h2 className="mt-2 font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium tracking-tight">More newsletters</h2></div><Button asChild variant="outline" className="rounded-sm border-border bg-card"><Link href="/newsletters">All newsletters</Link></Button></Reveal><Grid columns={3}>{more.map((entry, index) => <NewsletterCard key={entry.slug} newsletter={entry} index={index} />)}</Grid></div></section>
              <CtaBand />
            </>
          );
        }
      }
    }
    return notFound();
}
