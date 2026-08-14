import { IconRender } from '@/components/renderer/icon-renderer'
import { joinStyles } from '@/lib/make-styles'
import { IconBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export function IconBlockUI({ pageContext, ...iconBlock }: IconBlock & { pageContext: PageContext }) {

  return (
    <IconRender icon={typeof iconBlock.icon == 'object' ? iconBlock.icon?.name ?? "" : ""} iconStyles={joinStyles(iconBlock.iconStyles)} />
  )
}