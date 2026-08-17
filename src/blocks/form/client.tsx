'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { FormBlock } from '@/payload-types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { buildDefaultValues, buildSchema, FieldType, NormalizedFields } from '@/blocks/form/utils'
import { FormRegistration } from '@/blocks/form/formRegistration'
import { getClientSideURL } from '@/lib/get-url'
import { PageContext } from '@/types/page-context'
import { joinStyles } from '@/lib/make-styles'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'

export function FormBlockClient({
  pageContext,
  ...formBlock
}: FormBlock & {
  pageContext: PageContext
}) {
  const payloadForm = typeof formBlock.form === 'string' ? null : formBlock.form
  const router = useRouter()

  const fields: FieldType[] = payloadForm ? NormalizedFields(formBlock) : []
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formSchema = buildSchema(fields)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaultValues(fields),
  })

  if (!payloadForm) return null

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(undefined)
    const dataToSend = Object.entries(values).map(([field, value]) => ({
      field,
      value,
    }))

    try {
      const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: payloadForm?.id,
          submissionData: dataToSend,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        setError({
          message: result.errors?.[0]?.message || 'Internal Server Error',
          status: result.status,
        })
        return
      }
      setHasSubmitted(true)
      form.reset()
      if (payloadForm?.confirmationType === 'redirect' && payloadForm?.redirect?.url) {
        router.push(payloadForm?.redirect.url)
      }
    } catch {
      setError({ message: 'Something went wrong.' })
      setHasSubmitted(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={joinStyles(formBlock.cardStyles)}>
      <CardHeader>
        <CardTitle className={joinStyles(formBlock.titleStyles)}>{payloadForm?.title}</CardTitle>
        {formBlock?.enableDescription && payloadForm.confirmationMessage ? (
          <CardDescription className={joinStyles(formBlock.descriptionStyles)}>
            <LexicalRenderer
              content={payloadForm.confirmationMessage.content}
              className={joinStyles(payloadForm.confirmationMessage.contentStyles)}
              pageContext={pageContext}
            />
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <FormRegistration
          fields={fields}
          form={form}
          pageContext={pageContext}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButton={payloadForm.submitButton}
        />
      </CardContent>
      {(hasSubmitted || error) && (
        <CardFooter>
          {hasSubmitted && payloadForm.confirmationType === 'message' && (
            <Alert>
              <AlertDescription>
                {payloadForm?.confirmationMessage?.content ? (
                  <LexicalRenderer
                    content={payloadForm.confirmationMessage.content}
                    className={joinStyles(payloadForm.confirmationMessage.contentStyles)}
                    pageContext={pageContext}
                  />
                ) : null}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className={joinStyles(payloadForm.confirmationMessage ? payloadForm.confirmationMessage.contentStyles : '' )}>{`${error.status || '500'}: ${error.message || ''}`}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
