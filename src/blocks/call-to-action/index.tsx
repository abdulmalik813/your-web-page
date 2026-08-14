import { CallToActionBlock } from '@/payload-types'
import { CardBlockUI } from '@/blocks/card'
import type { Media as MediaCollection } from '@/payload-types'
import { MediaBlockUI } from '@/blocks/media'
import { PageContext } from '@/types/page-context'
import { joinStyles } from '@/lib/make-styles'

export async function CallToActionBlockUI({
  pageContext,
  ...callToActionBlock
}: Partial<CallToActionBlock> & { pageContext: PageContext }) {
  if (!callToActionBlock.card) return null

  const media = callToActionBlock.media as MediaCollection | undefined

  return (
    <div className="overflow-hidden">
      <div className={joinStyles("relative w-screen flex items-center justify-center -mx-[50vw] left-1/2 right-1/2 py-16 sm:py-24", callToActionBlock.backgroundStyles)}>
        {media && media.url && (
          <div className={`absolute inset-0 w-full h-full select-none`}>
            {/* @ts-expect-error there may be some mismatch between the expected types here */}
            <MediaBlockUI
              {...callToActionBlock}
              className="w-full h-full object-cover select-none pointer-events-none"
              pageContext={pageContext}
              priority
            />
          </div>
        )}

        <div className="relative z-20 flex justify-center p-4 w-full">
          <div className="max-w-4xl w-full">
            <CardBlockUI {...callToActionBlock.card} pageContext={pageContext} />
          </div>
        </div>
      </div>
    </div>
  )
}