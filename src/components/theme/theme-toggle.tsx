'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const cycleTheme = () => {
    let nextTheme = 'system'
    if (theme === 'system') nextTheme = 'dark'
    else if (theme === 'dark') nextTheme = 'light'

    setTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 opacity-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon-lg" onClick={cycleTheme} className="w-10 h-10">
      {theme === 'system' && <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />}
      {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />}
      {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
