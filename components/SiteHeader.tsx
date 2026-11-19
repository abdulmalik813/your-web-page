'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  settings: any;
  navigation: any;
  services: { slug: string; title: string }[];
}

export function SiteHeader({ settings, navigation, services }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSectionActive = (prefix: string) =>
    pathname === prefix || (prefix !== '/' && pathname.startsWith(`${prefix}/`));

  const navLinkClass =
    'flex h-10 min-w-0 max-w-48 items-center whitespace-normal rounded-sm border border-transparent px-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30';
  const activeNavLinkClass = 'border-border/70 bg-card text-foreground hover:bg-card hover:text-foreground';
  const mobileLinkClass =
    'h-auto min-h-12 w-full justify-start rounded-sm border border-border bg-card px-4 py-3 text-left text-base font-medium whitespace-normal no-underline hover:bg-muted hover:no-underline';

  return (
    <>
      <a
        className="absolute -left-full top-2 z-[100] bg-foreground px-4 py-3 font-medium text-background focus:left-2"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 bg-background text-foreground" id="top">
        <div className="mx-auto flex min-h-[82px] w-full max-w-[1360px] items-center gap-2 px-4 sm:px-6 lg:gap-4 lg:px-8">
          <Link
            className="group flex min-w-0 shrink-0 items-center gap-3 border border-border/70 bg-background px-2 py-2 text-sm font-bold tracking-tight text-foreground no-underline transition-colors hover:border-primary/50 sm:text-base"
            href="/"
            aria-label={`${settings.brand} — home`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="grid min-w-0 max-w-[32vw] gap-0.5 break-words sm:max-w-48 [overflow-wrap:anywhere]">
              <span>{settings.shortMark}</span>
            </span>
          </Link>

          <NavigationMenu
            viewport={false}
            className="hidden max-w-none flex-1 justify-start lg:flex"
          >
            <NavigationMenuList className="justify-start gap-1">
              {(navigation.items || []).map((item: { id?: string; label: string; href: string }) => {
                const active = isSectionActive(item.href);
                if (item.href === '/services') {
                  return (
                    <NavigationMenuItem key={item.id || item.href}>
                      <NavigationMenuTrigger
                        className={cn(
                          navLinkClass,
                          active && activeNavLinkClass,
                          active
                            ? 'data-open:bg-primary data-open:text-primary-foreground'
                            : 'data-open:bg-muted data-open:text-foreground',
                        )}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent
                        className="left-0 top-full mt-2 max-h-[75vh] w-[min(72vw,54rem)] min-w-[40rem] overflow-auto rounded-sm border border-border bg-popover p-0 text-popover-foreground shadow-none ring-1 ring-border group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:overflow-auto group-data-[viewport=false]/navigation-menu:rounded-sm group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-none group-data-[viewport=false]/navigation-menu:ring-border"
                      >
                        <div className="grid sm:grid-cols-[minmax(12rem,0.72fr)_minmax(0,1.28fr)]">
                          <div className="border-b border-border bg-muted/40 p-5 sm:border-b-0 sm:border-r sm:p-6">
                            <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary">Services</p>
                            <p className="mt-3 max-w-[25ch] font-heading text-2xl leading-tight tracking-tight text-foreground">Thoughtful digital work, built around your goals.</p>
                            <NavigationMenuLink asChild className="mt-5 block rounded-sm p-0">
                              <Link
                                className={cn(
                                  'group flex min-h-11 items-center justify-between gap-3 border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground no-underline transition-colors hover:border-primary/50 hover:bg-card',
                                  pathname === '/services' && 'border-primary/50 text-primary',
                                )}
                                href="/services"
                                aria-current={pathname === '/services' ? 'page' : undefined}
                              >
                                <span>Explore all services</span>
                                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                              </Link>
                            </NavigationMenuLink>
                          </div>
                          <ul className="m-0 grid list-none gap-px bg-border p-0 sm:grid-cols-2">
                            {services.map((service, index) => {
                              const servicePath = `/services/${service.slug}`;
                              const serviceActive = pathname === servicePath;
                              return (
                                <li
                                  className={cn(
                                    'min-w-0 bg-popover',
                                    services.length % 2 === 1 && index === services.length - 1 && 'sm:col-span-2',
                                  )}
                                  key={service.slug}
                                >
                                  <NavigationMenuLink asChild className="block h-full rounded-sm p-0">
                                    <Link
                                      className={cn(
                                        'group flex h-full min-h-16 min-w-0 items-center justify-between gap-3 bg-popover px-4 py-3 text-sm font-medium text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground',
                                        serviceActive && 'bg-primary/10 text-primary',
                                      )}
                                      href={servicePath}
                                      aria-current={serviceActive ? 'page' : undefined}
                                    >
                                      <span className="min-w-0 whitespace-normal break-normal">{service.title}</span>
                                      <ArrowRight className="size-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={item.id || item.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(navLinkClass, active && activeNavLinkClass)}
                    >
                      <Link href={item.href} aria-current={active ? 'page' : undefined}>
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0 lg:gap-2">
            <ThemeSwitcher />
            <Button asChild className="hidden h-10 rounded-sm bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90 lg:inline-flex">
              <Link href={navigation.contactHref}>{navigation.contactLabel}</Link>
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-sm border-border lg:hidden"
                  aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(90vw,26rem)] gap-0 border-l border-border bg-background p-0 text-foreground sm:max-w-none"
              >
                <SheetHeader className="border-b border-border px-6 py-5 pr-16 text-left">
                  <SheetTitle className="break-words text-lg font-semibold tracking-tight [overflow-wrap:anywhere]">{settings.shortMark}</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Explore our work and services.
                  </SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile primary" className="overflow-y-auto px-4 py-4">
                  <ul className="m-0 grid list-none gap-2 p-0">
                    {(navigation.items || []).map((item: { id?: string; label: string; href: string }) => {
                      const active = isSectionActive(item.href);
                      if (item.href === '/services') {
                        return (
                          <li key={item.id || item.href}>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem className="border-b-0" value="services">
                                <AccordionTrigger className={cn(
                                  'rounded-sm px-4 py-3 text-base font-medium no-underline hover:bg-accent hover:no-underline',
                                  active && 'bg-primary/10 text-primary',
                                )}>
                                  {item.label}
                                </AccordionTrigger>
                                <AccordionContent className="px-2 pb-2">
                                  <ul className="grid list-none gap-1 p-0">
                                    <li>
                                      <Button
                                        asChild
                                        variant="ghost"
                                        className={cn(mobileLinkClass, pathname === '/services' && 'bg-primary/10 text-primary')}
                                        style={{ textDecoration: 'none' }}
                                      >
                                        <Link href="/services" onClick={() => setMobileOpen(false)}>
                                          All services
                                        </Link>
                                      </Button>
                                    </li>
                                    {services.map((service) => {
                                      const servicePath = `/services/${service.slug}`;
                                      const serviceActive = pathname === servicePath;
                                      return (
                                        <li key={service.slug}>
                                          <Button
                                            asChild
                                            variant="ghost"
                                            className={cn(mobileLinkClass, serviceActive && 'bg-primary/10 text-primary')}
                                            style={{ textDecoration: 'none' }}
                                          >
                                            <Link href={servicePath} onClick={() => setMobileOpen(false)}>
                                              {service.title}
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
                        <li key={item.id || item.href}>
                          <Button
                            asChild
                            variant="ghost"
                            className={cn(mobileLinkClass, active && 'bg-primary/10 text-primary')}
                            style={{ textDecoration: 'none' }}
                          >
                            <Link href={item.href} onClick={() => setMobileOpen(false)}>
                              {item.label}
                            </Link>
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="mt-auto grid gap-2 border-t border-border p-4">
                  <Button asChild className="h-11 rounded-sm font-semibold">
                    <Link href={navigation.contactHref} onClick={() => setMobileOpen(false)}>
                      {navigation.contactLabel}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-sm font-semibold">
                    <Link href={navigation.projectHref} onClick={() => setMobileOpen(false)}>
                      {navigation.projectLabel}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
