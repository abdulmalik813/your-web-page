import { FormBlockClient } from '@/blocks/form/client'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import type { FormBlock as FormBlockType } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { joinStyles } from '@/lib/make-styles'

export async function FormBlockUI({
  pageContext,
  ...formBlock
}: FormBlockType & { pageContext: PageContext }) {
  const payloadForm = typeof formBlock.form === 'string' ? null : formBlock.form

  const descriptionContent =
    formBlock?.enableDescription && formBlock.description ? (
      <LexicalRenderer content={formBlock.description} pageContext={pageContext} />
    ) : null

  const confirmationContent = payloadForm?.confirmationMessage?.content ? (
    <LexicalRenderer
      content={payloadForm.confirmationMessage.content}
      className={joinStyles(payloadForm.confirmationMessage.contentStyles)}
      pageContext={pageContext}
    />
  ) : null

  return (
    <FormBlockClient
      {...formBlock}
      pageContext={pageContext}
      renderedDescription={descriptionContent}
      renderedConfirmation={confirmationContent}
    />
  )
}
