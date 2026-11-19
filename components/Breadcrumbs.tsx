import { Fragment } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <Breadcrumb className="mb-7 font-mono text-sm font-medium uppercase tracking-[0.1em] text-muted-foreground" suppressHydrationWarning>
      <BreadcrumbList suppressHydrationWarning>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem suppressHydrationWarning>
              {item.href ? (
                <BreadcrumbLink asChild className="break-words border-b border-foreground text-foreground hover:bg-accent hover:text-accent-foreground [overflow-wrap:anywhere]" suppressHydrationWarning>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="break-words font-medium text-foreground [overflow-wrap:anywhere]" suppressHydrationWarning>
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 ? <BreadcrumbSeparator><span aria-hidden="true">/</span></BreadcrumbSeparator> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
