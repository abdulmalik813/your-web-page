import type { ReactNode } from 'react';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';
import { Reveal } from './Reveal';

interface PageHeaderProps {
  label: string;
  title: string;
  lead?: string;
  breadcrumbs?: BreadcrumbItem[];
  preTitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  label,
  title,
  lead,
  breadcrumbs,
  preTitle,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <section className={`relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-transparent via-muted/20 to-transparent py-8 text-foreground md:py-10 lg:py-14 ${className}`.trim()}>
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:28px_28px]" aria-hidden="true" />
      <Reveal className="relative mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11" direction="left" animate={false}>
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
        {preTitle}
        <div className="max-w-5xl">
          {label ? <p className="mb-4 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-primary-strong [overflow-wrap:anywhere]">{label}</p> : null}
          <h1 className="my-4 max-w-[18ch] break-words font-heading text-[clamp(2.5rem,6.5vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.045em] [overflow-wrap:anywhere]">
            {title}
          </h1>
          {lead ? <p className="max-w-[62ch] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.6] text-muted-foreground">{lead}</p> : null}
          {children}
        </div>
      </Reveal>
    </section>
  );
}
