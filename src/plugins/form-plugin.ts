import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { TimeBlock } from '@/fields/time'
import { formOverrides } from '@/fields/form-overrides'
import config from '@payload-config'
import { getPayload } from 'payload'
import Handlebars from 'handlebars'
import { FormattedEmail } from 'node_modules/@payloadcms/plugin-form-builder/dist/types'
import { BasePayload } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

type SubmissionField = {
  field: string
  value: any
}

function processWithHandlebars(
  templateString: string,
  submissionData: SubmissionField[],
  payload: BasePayload,
): string {
  if (!templateString) return ''
  const context = submissionData.reduce(
    (acc, curr) => {
      if (curr?.field) {
        acc[curr.field] = curr.value
      }
      return acc
    },
    {} as Record<string, any>,
  )

  try {
    const template = Handlebars.compile(templateString)
    return template(context)
  } catch (error) {
    payload.logger.error('Handlebars compilation error: ' + error)
    return ''
  }
}

Handlebars.registerHelper('script', function (codeString: string, options) {
  try {
    const context = options.data.root || {}
    const evalFn = new Function('context', `
      with (context) {
        return (${codeString});
      }
    `)

    return evalFn(context) ?? ''
  } catch (error) {
    console.error(`Handlebars script helper error for expression: "${codeString}"`, error)
    return ''
  }
})

export const formPlugin = formBuilderPlugin({
  fields: {
    payment: false,
    state: false,
    country: false,
    date: true,
    time: TimeBlock,
  },
  formOverrides: {
    fields: formOverrides,
  },
  beforeEmail: async (_, params) => {
    const payload: BasePayload = params?.req?.payload ?? (await getPayload({ config }))
    const submissionData: SubmissionField[] = (params?.data?.submissionData ||
      []) as SubmissionField[]

    const formDoc = await payload.findByID({
      collection: 'forms',
      id: typeof params?.data?.form === 'string' ? params.data.form : params?.data?.form?.id,
    })

    const emails: FormattedEmail[] = []

    for (const emailConfig of (formDoc as any)?.emails || []) {
      let messageContent = ''
      if (emailConfig.messageType === 'html') {
        messageContent = emailConfig.htmlMessage || ''
      } else {
        if (emailConfig.message && typeof emailConfig.message === 'object') {
          messageContent = convertLexicalToHTML({ data: emailConfig.message })
        } else if (typeof emailConfig.message === 'string') {
          messageContent = emailConfig.message
        }
      }
      const processedHtml = processWithHandlebars(messageContent, submissionData, payload)
      emails.push({
        to: processWithHandlebars(emailConfig.emailTo || '', submissionData, payload),
        subject: processWithHandlebars(emailConfig.subject || '', submissionData, payload),
        from: processWithHandlebars(emailConfig.emailFrom || '', submissionData, payload),
        cc: processWithHandlebars(emailConfig.cc || '', submissionData, payload),
        bcc: processWithHandlebars(emailConfig.bcc || '', submissionData, payload),
        html: processedHtml,
        replyTo: processWithHandlebars(emailConfig.replyTo || '', submissionData, payload),
      } as FormattedEmail)
    }
    return emails
  },
})