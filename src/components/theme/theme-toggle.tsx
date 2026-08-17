'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/button'

const subscribe = () => () => {}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  const cycleTheme = () => {
    let nextTheme = 'system'

    if (theme === 'system') nextTheme = 'dark'
    else if (theme === 'dark') nextTheme = 'light'

    setTheme(nextTheme)
  }

  return (
    <Button
      variant="outline"
      size="icon-lg"
      onClick={cycleTheme}
      className="w-12 h-12"
    >
      <span className="relative flex h-[1.4rem] w-[1.4rem] items-center justify-center">
        {mounted && (
          <>
            {theme === 'system' && (
              <Monitor className="absolute h-[1.4rem] w-[1.4rem]" />
            )}

            {theme === 'dark' && (
              <Moon className="absolute h-[1.4rem] w-[1.4rem]" />
            )}

            {theme === 'light' && (
              <Sun className="absolute h-[1.4rem] w-[1.4rem]" />
            )}
          </>
        )}
      </span>

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}