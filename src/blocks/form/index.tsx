import { FormBlockClient } from '@/blocks/form/client'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import type { FormBlock as FormBlockType } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function FormBlockUI({
  pageContext,
  ...formBlock
}: FormBlockType & { pageContext: PageContext }) {
  const payloadForm = typeof formBlock.form === 'number' ? null : formBlock.form

  const descriptionContent =
    formBlock?.enableDescription && formBlock.description ? (
      <LexicalRenderer content={formBlock.description} pageContext={pageContext} />
    ) : null

  const confirmationContent = payloadForm?.confirmationMessage ? (
    <LexicalRenderer content={payloadForm.confirmationMessage} pageContext={pageContext} />
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
