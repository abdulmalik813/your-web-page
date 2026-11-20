'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { isSectionActive, type NavItem } from './nav';

type MobileNavProps = {
  brand: string;
  items: NavItem[];
  onNavigate: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  pathname: string;
};

export function MobileNav({
  brand,
  items,
  onNavigate,
  onOpenChange,
  open,
  pathname,
}: MobileNavProps) {
  const mobileLinkClass =
    'h-auto min-h-12 w-full justify-start rounded-sm border border-border bg-card px-4 py-3 text-left text-base font-medium whitespace-normal no-underline hover:bg-muted hover:no-underline';

  return (
            <Sheet open={open} onOpenChange={onOpenChange}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-sm border-border lg:hidden"
                  aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                >
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(90vw,26rem)] gap-0 border-l border-border bg-background p-0 text-foreground sm:max-w-none"
              >
                <SheetHeader className="border-b border-border px-6 py-5 pr-16 text-left">
                  <SheetTitle className="break-words text-lg font-semibold tracking-tight [overflow-wrap:anywhere]">{brand}</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Explore our work and services.
                  </SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile primary" className="overflow-y-auto px-4 py-4">
                  <ul className="m-0 grid list-none gap-2 p-0">
                    {items.map(({ id, link, children, dropdown }) => {
                      const active = isSectionActive(pathname, link.href);
                      const ctaLabel = dropdown.ctaLabel?.trim() || link.label;

                      if (children.length > 0) {
                        return (
                          <li key={id || link.href}>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem className="border-b-0" value={id || link.href}>
                                <AccordionTrigger className={cn(
                                  'rounded-sm px-4 py-3 text-base font-medium no-underline hover:bg-accent hover:no-underline',
                                  active && 'bg-primary/10 text-primary-strong',
                                )}>
                                  {link.label}
                                </AccordionTrigger>
                                <AccordionContent className="px-2 pb-2">
                                  <ul className="grid list-none gap-1 p-0">
                                    <li>
                                      <Button
                                        asChild
                                        variant="ghost"
                                        className={cn(mobileLinkClass, pathname === link.href && 'bg-primary/10 text-primary-strong')}
                                        style={{ textDecoration: 'none' }}
                                      >
                                        <Link
                                          href={link.href}
                                          target={link.newTab ? '_blank' : undefined}
                                          rel={link.newTab ? 'noopener noreferrer' : undefined}
                                          onClick={() => onNavigate()}
                                        >
                                          {ctaLabel}
                                        </Link>
                                      </Button>
                                    </li>
                                    {children.map(({ id: childId, link: child }) => {
                                      const childIsActive = pathname === child.href;
                                      return (
                                        <li key={childId || child.href}>
                                          <Button
                                            asChild
                                            variant="ghost"
                                            className={cn(mobileLinkClass, childIsActive && 'bg-primary/10 text-primary-strong')}
                                            style={{ textDecoration: 'none' }}
                                          >
                                            <Link
                                              href={child.href}
                                              target={child.newTab ? '_blank' : undefined}
                                              rel={child.newTab ? 'noopener noreferrer' : undefined}
                                              onClick={() => onNavigate()}
                                            >
                                              {child.label}
                                            </Link>
                                          </Button>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </li>
                        );
                      }

                      return (
                        <li key={id || link.href}>
                          <Button
                            asChild
                            variant="ghost"
                            className={cn(mobileLinkClass, active && 'bg-primary/10 text-primary-strong')}
                            style={{ textDecoration: 'none' }}
                          >
                            <Link
                              href={link.href}
                              target={link.newTab ? '_blank' : undefined}
                              rel={link.newTab ? 'noopener noreferrer' : undefined}
                              onClick={() => onNavigate()}
                            >
                              {link.label}
                            </Link>
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="mt-auto grid gap-2 border-t border-border p-4">
                  <Button asChild className="h-11 rounded-sm font-semibold">
                    <Link href="/contact" onClick={() => onNavigate()}>
                      Contact
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

  );
}
