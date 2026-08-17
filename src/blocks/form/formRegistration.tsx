import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { UseFormReturn } from 'react-hook-form'
import { LexicalRenderer } from '@/components/renderer/lexical-renderer'
import { FieldType } from '@/blocks/form/utils'
import { PageContext } from '@/types/page-context'
import type { FormBlock } from '@/payload-types'
import { IconRender } from '@/components/renderer/icon-renderer'
import { joinStyles } from '@/lib/make-styles'
import { Button } from '@/components/button'

type PayloadForm = Exclude<FormBlock['form'], string>

interface FormRegistrationProps {
  fields: FieldType[]
  form: UseFormReturn<any>
  onSubmit: (values: any) => Promise<void>
  isSubmitting: boolean
  submitButton?: PayloadForm['submitButton']
  pageContext: PageContext
}

export function FormRegistration({
  fields,
  form,
  onSubmit,
  isSubmitting,
  submitButton,
  pageContext,
}: FormRegistrationProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap gap-4 w-full">
          {fields?.map((field) => {
            switch (field.blockType) {
              case 'text':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={field.width} id={field.name}>
                        {field.label && (
                          <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={field.placeholder}
                            {...formField}
                            value={formField.value as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'email':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={field.width} id={field.name}>
                        {field.label && (
                          <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={field.placeholder}
                            {...formField}
                            value={formField.value as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'textarea':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={field.width} id={field.name}>
                        {field.label && (
                          <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <FormControl>
                          <Textarea
                            placeholder={field.placeholder}
                            {...formField}
                            value={formField.value as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'number':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={field.width} id={field.name}>
                        {field.label && (
                          <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={field.placeholder}
                            {...formField}
                            value={formField.value as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'date':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={field.width} id={field.name}>
                        {field.label && (
                          <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <FormControl>
                          <Input type="date" {...formField} value={formField.value as string} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'time':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={field.width} id={field.name}>
                        {field.label && (
                          <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <FormControl>
                          <Input type="time" {...formField} value={formField.value as string} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'checkbox':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem
                        className={`${field.width} flex flex-row items-start`}
                        id={field.name}
                      >
                        <FormControl>
                          <Checkbox
                            checked={formField.value as boolean}
                            onCheckedChange={formField.onChange}
                          />
                        </FormControl>
                        {field.label && (
                          <FormLabel className="mt-0.5">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'select':
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={field.width} id={field.name}>
                        {field.label && (
                          <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </FormLabel>
                        )}
                        <Select
                          onValueChange={formField.onChange}
                          defaultValue={formField.value as string}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={field.placeholder || 'Select an option'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.id} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )

              case 'message':
                if (!field.richText) return null
                return (
                  <div key={field.id} className={field.width}>
                    <LexicalRenderer
                      content={field.richText}
                      className="text-left text-foreground"
                      pageContext={pageContext}
                    />
                  </div>
                )

              default:
                return null
            }
          })}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={joinStyles(submitButton?.styles)}
          size={submitButton?.buttonSize ?? 'default'}
          variant={submitButton?.buttonType}
        >
          {isSubmitting && <Spinner />}

          {!isSubmitting &&
            submitButton?.axis !== 'after' &&
            typeof submitButton?.icon === 'object' &&
            submitButton.icon?.name && (
              <IconRender
                icon={submitButton.icon.name}
                iconStyles={joinStyles(submitButton.iconStyles)}
              />
            )}

          <span className="wrap-break-word whitespace-normal">
            {submitButton?.label || 'Submit'}
          </span>

          {!isSubmitting &&
            submitButton?.axis === 'after' &&
            typeof submitButton?.icon === 'object' &&
            submitButton.icon?.name && (
              <IconRender
                icon={submitButton.icon.name}
                iconStyles={joinStyles(submitButton.iconStyles)}
              />
            )}
        </Button>
      </form>
    </Form>
  )
}
