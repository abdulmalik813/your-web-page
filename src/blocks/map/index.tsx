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
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full h-full"
      />
      {text && (
        <div className="absolute top-4 left-4 bg-background px-5 py-3 font-bold uppercase shadow-lg">
          {text}
        </div>
      )}
    </div>
  )
}
