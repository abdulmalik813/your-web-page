import type { MapBlock as MapBlockType } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export function MapBlockUI({
  pageContext,
  mapUrl,
  text,
}: MapBlockType & {
  pageContext: PageContext
}) {
  if (!mapUrl) return null

  return (
    <div className="relative overflow-hidden h-full">
      <iframe
        src={mapUrl}
        title={text || 'Map'}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full h-full"
      />
    </div>
  )
}
