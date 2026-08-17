import { FormBlockClient } from '@/blocks/form/client'
import type { FormBlock as FormBlockType } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function FormBlockUI({
  pageContext,
  ...formBlock
}: FormBlockType & { pageContext: PageContext }) {
  return (
    <FormBlockClient
      {...formBlock}
      pageContext={pageContext}
    />
  )
}
