import { revalidateAll, revalidateGlobal } from '@/lib/revalidate'
import { Style } from '@/payload-types'
import { GlobalAfterChangeHook } from 'payload'

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc, req }) => {
  const additionalFonts = doc.additionalFonts || []

  const existingStyles = await req.payload.find({
    collection: 'styles',
    where: {
      className: {
        like: 'font-%',
      },
    },
    limit: 1000,
  })

  const currentFontIds = new Set(additionalFonts.map((font: any) => font.id))

  for (const font of additionalFonts) {
    if (font?.title != null && font?.title?.trim() !== '') {
      const className = `font-${font.id}`
      const existingStyle = existingStyles.docs.find((style) => style.className === className)

      if (!existingStyle) {
        await req.payload.create({
          collection: 'styles',
          data: {
            alias: font.title,
            className: className,
            tailwind: false,
            stylesheet: '',
          },
        })
      }
    }
  }

  const fontStyles = existingStyles.docs.filter((style: Style) =>
    style.className.startsWith('font-'),
  )

  const orphanedFontStyles = fontStyles.filter((style: Style) => {
    const styleId = style.className.replace('font-', '')
    return !currentFontIds.has(styleId)
  })

  for (const style of orphanedFontStyles) {
    await req.payload.delete({
      collection: 'styles',
      id: style.id,
    })
  }

  if (doc._status === 'draft') {
    return doc
  }

  await revalidateAll()
  return doc
}

export const revalidateNavBar: GlobalAfterChangeHook = async ({ doc }) => {
  if (doc._status === 'draft') {
    return doc
  }

  revalidateGlobal('navigationBar')
  return doc
}

export const revalidateFooter: GlobalAfterChangeHook = async ({ doc }) => {
  if (doc._status === 'draft') {
    return doc
  }

  revalidateGlobal('footer')
  return doc
}

export const revalidateSocial: GlobalAfterChangeHook = async ({ doc }) => {
  if (doc._status === 'draft') {
    return doc
  }

  revalidateGlobal('social')
  return doc
}