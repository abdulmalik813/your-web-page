'use client'

import { Setting } from '@/payload-types'
import { Media } from '@/components/media'
import { useTheme } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

export default function Logo() {
  const { theme } = useTheme()

  const [settings, setSettings] = useState<Setting | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/globals/settings')

        if (response.ok) {
          const data: Setting = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const lightLogo = settings?.logo
  const darkLogo = settings?.logoDark ?? settings?.logo

  const logo = theme === 'dark' ? darkLogo : lightLogo

  if (!logo || typeof logo !== 'object') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-semibold text-lg">Payload</span>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Media
        resource={logo}
        alt="Logo"
        imgClassName="h-8 object-contain"
      />
    </div>
  )
}