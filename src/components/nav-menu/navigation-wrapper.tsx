'use client'

import React from 'react'
import { useEffect, useState } from 'react'

interface NavigationBarWrapperProps {
  children: React.ReactNode
  hideWhenIdle: boolean | null | undefined
  idleTimeout: number | null | undefined
}

export function NavigationBarWrapper({
  children,
  hideWhenIdle,
  idleTimeout = 0,
}: NavigationBarWrapperProps) {
  const [isAtTop, setIsAtTop] = useState(true)
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!hideWhenIdle) {
      return
    }

    const header = document.querySelector('header[role="navigation"]') as HTMLElement
    if (header) {
      header.style.transition = 'opacity 0.3s ease'
    }

    const handleActivity = () => {
      const header = document.querySelector('header[role="navigation"]') as HTMLElement
      if (header) {
        header.style.opacity = '1'
        header.style.pointerEvents = 'auto'
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      if (!isAtTop) {
        idleTimerRef.current = setTimeout(() => {
          const header = document.querySelector('header[role="navigation"]') as HTMLElement
          if (header) {
            header.style.opacity = '0'
            header.style.pointerEvents = 'none'
          }
        }, typeof idleTimeout === 'number' ? idleTimeout : 0)
      }
    }

    const handleScroll = () => {
      const atTop = window.scrollY < 50
      setIsAtTop(atTop)
      
      if (atTop) {
        const header = document.querySelector('header[role="navigation"]') as HTMLElement
        if (header) {
          header.style.opacity = '1'
          header.style.pointerEvents = 'auto'
        }
      }
    }

    handleActivity()

    const events = ['mousemove', 'keydown', 'touchstart', 'touchmove', 'click', 'wheel']

    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    window.addEventListener('scroll', handleScroll)

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      window.removeEventListener('scroll', handleScroll)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [hideWhenIdle, idleTimeout, isAtTop])

  return <>{children}</>
}
