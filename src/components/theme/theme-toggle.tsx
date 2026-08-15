"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const cycleTheme = () => {
    let nextTheme = "system"
    if (theme === "system") nextTheme = "dark"
    else if (theme === "dark") nextTheme = "light"

    setTheme(nextTheme)
    toast.success(`Theme set to ${nextTheme}`, {
      description: `You are now using the ${nextTheme} theme.`,
      icon: nextTheme === "system" ? <Monitor className="h-4 w-4" /> : nextTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />,
    })
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 border-primary text-primary opacity-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme} className="w-10 h-10 border-primary text-primary" title={`Current theme: ${theme}`}>
      {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />}
      {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />}
      {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
