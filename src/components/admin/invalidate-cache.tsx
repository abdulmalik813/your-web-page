'use client'

import { Button } from '@payloadcms/ui'
import React, { useState } from 'react'

export const CacheInvalidationButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleInvalidateCache = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleInvalidateCache} disabled={isLoading}>
      {isLoading ? 'Clearing...' : 'Clear Cache'}
    </Button>
  )
}
