'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--paper')
      .trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }, [mounted, resolvedTheme]);

  const CurrentThemeIcon = !mounted || theme === 'system'
    ? Monitor
    : theme === 'dark'
      ? Moon
      : Sun;
  const nextTheme = theme === 'light'
    ? 'dark'
    : theme === 'dark'
      ? 'system'
      : 'light';
  const themeLabel = mounted
    ? `Theme: ${theme || 'system'}. Activate to switch to ${nextTheme}.`
    : 'Switch color theme';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-10 rounded-sm border border-border/70 bg-card p-0 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label={themeLabel}
      title={themeLabel}
      onClick={() => setTheme(nextTheme)}
    >
      <CurrentThemeIcon aria-hidden="true" />
    </Button>
  );
}
