'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { DesktopNav } from '@/components/site-header/DesktopNav';
import { MobileNav } from '@/components/site-header/MobileNav';
import { buildNavItems } from '@/components/site-header/nav';

interface SiteHeaderProps {
  navigation: Parameters<typeof buildNavItems>[0];
  settings: {
    brand?: string | null;
    shortMark?: string | null;
  };
}

export function SiteHeader({ settings, navigation }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = buildNavItems(navigation);

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-foreground focus:px-4 focus:py-3 focus:font-medium focus:text-background"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <header
        className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md text-foreground transition-colors"
        id="top"
      >
        <div className="mx-auto flex min-h-16 w-full max-w-[1360px] items-center justify-between gap-2 px-4 sm:min-h-[82px] sm:px-6 lg:gap-4 lg:px-8">
          <Link
            className="group flex min-w-0 shrink-0 items-center gap-3 border border-border/70 bg-background px-2 py-2 text-sm font-bold tracking-tight text-foreground no-underline transition-colors hover:border-primary/50 sm:text-base"
            href="/"
            aria-label={`${settings.brand ?? ''} — home`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="grid min-w-0 max-w-[48vw] gap-0.5 break-words sm:max-w-48 [overflow-wrap:anywhere]">
              <span>{settings.shortMark}</span>
            </span>
          </Link>

          <DesktopNav items={navItems} pathname={pathname} />

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0 lg:gap-2">
            <ThemeSwitcher />
            <Button
              asChild
              className="hidden h-10 rounded-sm bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90 lg:inline-flex"
            >
              <Link href="/contact">Contact</Link>
            </Button>
            <MobileNav
              brand={settings.shortMark ?? ''}
              items={navItems}
              open={mobileOpen}
              onOpenChange={setMobileOpen}
              onNavigate={() => setMobileOpen(false)}
              pathname={pathname}
            />
          </div>
        </div>
      </header>
    </>
  );
}
