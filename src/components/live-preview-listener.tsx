'use client'
import { getClientSideURL } from '@/lib/get-url'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function LivePreviewListener() {
  const router = useRouter()

  useEffect(() => {
    const fetchAndApplyStylesheet = async () => {
      try {
        const response = await fetch(`/api/stylesheet?draft=1&t=${Date.now()}`, {
          cache: 'no-store',
        })
        if (response.ok) {
          const css = await response.text()
          let styleEl = document.getElementById('payload-live-stylesheet') as HTMLStyleElement
          if (!styleEl) {
            styleEl = document.createElement('style')
            styleEl.id = 'payload-live-stylesheet'
            document.head.appendChild(styleEl)
          }
          styleEl.innerHTML = css
        }
      } catch (err) {
        console.error('Failed to reload live preview stylesheet:', err)
      }
    }

    const handleMessage = async (event: MessageEvent) => {
      const data = event.data
      if (!data) return

      if (data.type === 'payload-live-preview' && data.globalSlug === 'settings') {
        window.location.reload()
        return
      }

      if (
        data.collectionSlug === 'styles' ||
        data.type === 'payload-live-preview'
      ) {
        await fetchAndApplyStylesheet()
        router.refresh()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}