import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { isSectionActive, type NavItem } from './nav';

type DesktopNavProps = {
  items: NavItem[];
  pathname: string;
};

export function DesktopNav({ items, pathname }: DesktopNavProps) {
  const navLinkClass =
    'flex h-10 min-w-0 max-w-48 items-center whitespace-normal rounded-sm border border-transparent px-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30';
  const activeNavLinkClass =
    'border-border/70 bg-card text-foreground hover:bg-card hover:text-foreground';

  return (
          <NavigationMenu
            viewport={false}
            className="hidden max-w-none flex-1 justify-start lg:flex"
          >
            <NavigationMenuList className="justify-start gap-1">
              {items.map(({ id, link, children, dropdown }) => {
                const active = isSectionActive(pathname, link.href);
                const ctaLabel = dropdown.ctaLabel?.trim() || link.label;
                const eyebrow = dropdown.eyebrow?.trim() || link.label;
                const heading = dropdown.heading?.trim();

                if (children.length > 0) {
                  return (
                    <NavigationMenuItem key={id || link.href}>
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
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="left-0 top-full mt-2 max-h-[75vh] w-[min(72vw,54rem)] min-w-[40rem] overflow-auto rounded-sm border border-border bg-popover p-0 text-popover-foreground shadow-none ring-1 ring-border group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:overflow-auto group-data-[viewport=false]/navigation-menu:rounded-sm group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-none group-data-[viewport=false]/navigation-menu:ring-border">
                        <div className="grid sm:grid-cols-[minmax(12rem,0.72fr)_minmax(0,1.28fr)]">
                          <div className="border-b border-border bg-muted/40 p-5 sm:border-b-0 sm:border-r sm:p-6">
                            <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary-strong">{eyebrow}</p>
                            {heading ? (
                              <p className="mt-3 max-w-[25ch] font-heading text-2xl leading-tight tracking-tight text-foreground">{heading}</p>
                            ) : null}
                            <NavigationMenuLink asChild className="mt-5 block rounded-sm p-0">
                              <Link
                                className={cn(
                                  'group flex min-h-11 items-center justify-between gap-3 border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground no-underline transition-colors hover:border-primary/50 hover:bg-card',
                                  pathname === link.href && 'border-primary/50 text-primary-strong',
                                )}
                                href={link.href}
                                target={link.newTab ? '_blank' : undefined}
                                rel={link.newTab ? 'noopener noreferrer' : undefined}
                                aria-current={pathname === link.href ? 'page' : undefined}
                              >
                                <span>{ctaLabel}</span>
                                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                              </Link>
                            </NavigationMenuLink>
                          </div>
                          <ul className="m-0 grid list-none gap-px bg-border p-0 sm:grid-cols-2">
                            {children.map(({ id: childId, link: child }, index) => {
                              const childIsActive = pathname === child.href;
                              return (
                                <li
                                  className={cn(
                                    'min-w-0 bg-popover',
                                    children.length % 2 === 1 && index === children.length - 1 && 'sm:col-span-2',
                                  )}
                                  key={childId || child.href}
                                >
                                  <NavigationMenuLink asChild className="block h-full rounded-sm p-0">
                                    <Link
                                      className={cn(
                                        'group flex h-full min-h-16 min-w-0 items-center justify-between gap-3 bg-popover px-4 py-3 text-sm font-medium text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground',
                                        childIsActive && 'bg-primary/10 text-primary-strong',
                                      )}
                                      href={child.href}
                                      target={child.newTab ? '_blank' : undefined}
                                      rel={child.newTab ? 'noopener noreferrer' : undefined}
                                      aria-current={childIsActive ? 'page' : undefined}
                                    >
                                      <span className="min-w-0 whitespace-normal break-normal">{child.label}</span>
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
                  <NavigationMenuItem key={id || link.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(navLinkClass, active && activeNavLinkClass)}
                    >
                      <Link
                        href={link.href}
                        target={link.newTab ? '_blank' : undefined}
                        rel={link.newTab ? 'noopener noreferrer' : undefined}
                        aria-current={active ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

  );
}
