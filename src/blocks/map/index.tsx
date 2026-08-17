import type { MapBlock as MapBlockType } from '@/payload-types'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'

export function MapBlockUI({
  pageContext,
  mapUrl,
  text,
  styles,
}: MapBlockType & {
  pageContext: PageContext
}) {
  if (!mapUrl) return null

  return (
    <div className={joinStyles('relative', styles)}>
      <iframe
        src={mapUrl}
        title={text || 'Map'}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      {text && (
        <div className="absolute bottom-4 left-4 bg-black px-5 py-3 font-bold uppercase text-white shadow-lg">
          {text}
        </div>
      )}
    </div>
  )
}