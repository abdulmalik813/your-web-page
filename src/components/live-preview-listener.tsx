'use client'
import { getClientSideURL } from '@/lib/get-url'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function LivePreviewListener() {
  const router = useRouter()
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'payload-live-preview' &&
        (event.data?.globalSlug === 'settings' || event.data?.collectionSlug === 'styles')
      ) {
        window.location.reload()
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])
  
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}