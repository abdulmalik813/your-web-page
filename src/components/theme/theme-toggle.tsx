'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

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
        <Monitor
          className={`absolute h-[1.4rem] w-[1.4rem] ${
            theme === 'system' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <Moon
          className={`absolute h-[1.4rem] w-[1.4rem] ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <Sun
          className={`absolute h-[1.4rem] w-[1.4rem] ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </span>

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}