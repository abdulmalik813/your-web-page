import { revalidateAll, revalidateGlobal } from '@/lib/revalidate'
import { Style } from '@/payload-types'
import { isFontData } from '@/lib/is-font-data'
import { GlobalAfterChangeHook } from 'payload'

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc, req }) => {
  // Skip all side-effects (including font style DB writes) for draft saves.
  // This prevents DB churn on every autosave keystroke (100ms interval).
  if (doc._status === 'draft') {
    return doc
  }

  const additionalFonts = doc.additionalFonts || []
  const currentFontIds = new Set(additionalFonts.map((font: any) => font.id))

  const existingStyles = await req.payload.find({
    collection: 'styles',
    where: {
      className: {
        like: 'font-%',
      },
    },
    limit: 1000,
    req,
  })

  const generateFontCSS = (font: any): string => {
    if (!font.id || !font.family || !font.fontData || !isFontData(font.fontData)) {
      return ''
    }
    const fontData = font.fontData
    const family = fontData.variable
      ? `'${fontData.family} Variable', sans-serif`
      : `'${fontData.family}', sans-serif`
    const weight = fontData.weight
    const style = fontData.style || 'normal'
    return `.font-${font.id} {\n  font-family: ${family} !important;\n  font-weight: ${weight} !important;\n  font-style: ${style} !important;\n  font-display: swap;\n}`
  }

  for (const font of additionalFonts) {
    if (font?.title != null && font?.title?.trim() !== '') {
      const className = `font-${font.id}`
      const stylesheet = generateFontCSS(font)
      const existingStyle = existingStyles.docs.find((style) => style.className === className)

      if (!existingStyle) {
        await req.payload.create({
          collection: 'styles',
          data: {
            alias: font.title,
            className: className,
            tailwind: false,
            stylesheet: stylesheet,
          },
          req,
        })
      } else if (existingStyle.stylesheet !== stylesheet || existingStyle.alias !== font.title) {
        await req.payload.update({
          collection: 'styles',
          id: existingStyle.id,
          data: {
            alias: font.title,
            stylesheet: stylesheet,
          },
          req,
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
      req,
    })
  }

  const activeFontSlugs = new Set<string>()
  if (doc.default?.fontData && isFontData(doc.default.fontData) && doc.default.fontData.id) {
    activeFontSlugs.add(doc.default.fontData.id)
  }
  for (const font of additionalFonts) {
    if (font?.fontData && isFontData(font.fontData) && font.fontData.id) {
      activeFontSlugs.add(font.fontData.id)
    }
  }

  const allFontFiles = await req.payload.find({
    collection: 'font-files',
    limit: 1000,
    req,
  })

  for (const fontFile of allFontFiles.docs) {
    if (fontFile.fontId && !activeFontSlugs.has(fontFile.fontId)) {
      await req.payload.delete({
        collection: 'font-files',
        id: fontFile.id,
        req,
      })
    }
  }

  await revalidateAll(req)
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
