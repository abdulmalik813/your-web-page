import type { FormBlock } from '@/payload-types'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import z from 'zod'

export function NormalizedFields({ form }: FormBlock): FieldType[] {
  if (typeof form === "number") return []

  const normalizedFields = form?.fields?.map((field) => {
    const name = "name" in field ? (field.name || "") : ""
    const id = field.id
    const blockType = field.blockType
    const required = "required" in field ? (field.required || false) : false
    const label = "label" in field ? (field.label || "") : ""

    const getWidth = () => {
      if (!("width" in field) || !field.width) return "w-full"

      if (field.width === 100) return "w-full"
      if (field.width === 50) return "w-full md:w-[calc(50%-0.5rem)]"
      if (field.width === 33) return "w-full md:w-[calc(33.333%-0.667rem)]"
      if (field.width === 66) return "w-full md:w-[calc(66.666%-0.333rem)]"
      if (field.width === 25) return "w-full md:w-[calc(25%-0.75rem)]"
      if (field.width === 75) return "w-full md:w-[calc(75%-0.25rem)]"
      return `w-full md:w-[calc(${field.width}%-0.5rem)]`
    }

    const width = getWidth()
    const placeholder = "placeholder" in field ? (field.placeholder || "") : ""
    const defaultValue = "defaultValue" in field ? (field.defaultValue || "") : ""
    const richText = "message" in field ? (field.message || null) : null
    const options = "options" in field ? (field.options || []) : []

    return {
      name,
      id,
      blockType,
      required,
      label,
      width,
      placeholder,
      defaultValue,
      richText,
      options,
    }
  })
  return normalizedFields || []
}

export type FieldType = {
  name: string
  id: string | null | undefined
  blockType: "number" | "checkbox" | "email" | "message" | "select" | "text" | "textarea" | "date" | "time"
  required: boolean
  label: string
  width: string
  placeholder: string
  defaultValue: string | number | true
  richText: DefaultTypedEditorState | null
  options: {
    label: string;
    value: string;
    id?: string | null | undefined;
  }[]
}


export const buildSchema = (fields: FieldType[]) => {
  const schemaFields: Record<string, any> = {}

  fields?.forEach((field) => {
    if (field.blockType === "message") return

    switch (field.blockType) {
      case "checkbox":
        schemaFields[field.name] = z.boolean().optional()
        break

      case "email":
        if (field.required) {
          schemaFields[field.name] = z.email("Invalid email address").min(1, `${field.label || field.name} is required`)
        } else {
          schemaFields[field.name] = z.email("Invalid email address").optional().or(z.literal(""))
        }
        break

      default:
        if (field.required) {
          schemaFields[field.name] = z.string().min(1, `${field.label || field.name} is required`)
        } else {
          schemaFields[field.name] = z.string().optional()
        }
    }
  })

  return z.object(schemaFields)
}

export const buildDefaultValues = (fields: FieldType[]) => {
  const defaults: Record<string, any> = {}

  fields?.forEach((field) => {
    if (field.blockType === "message") return
    defaults[field.name] = field.defaultValue
  })

  return defaults
}