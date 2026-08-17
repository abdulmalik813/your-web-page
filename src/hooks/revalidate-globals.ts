import { revalidateAll, revalidateGlobal } from '@/lib/revalidate'
import { Style } from '@/payload-types'
import { isFontData } from '@/lib/is-font-data'
import { GlobalAfterChangeHook } from 'payload'

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (doc._status === 'draft') {
    return doc
  }

  const additionalFonts = doc.additionalFonts || []
  const currentFontIds = new Set(additionalFonts.map((font: any) => font.id))

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

    return `.font-${font.id} {
  font-family: ${family} !important;
  font-weight: ${weight} !important;
  font-style: ${style} !important;
  font-display: swap;
}`
  }

  const upsertFontStyle = async ({
    alias,
    className,
    stylesheet,
  }: {
    alias: string
    className: string
    stylesheet: string
  }) => {
    const existingByClass = await req.payload.find({
      collection: 'styles',
      where: {
        className: {
          equals: className,
        },
      },
      limit: 1,
      req,
      overrideAccess: true,
    })

    const existingByAlias = await req.payload.find({
      collection: 'styles',
      where: {
        alias: {
          equals: alias,
        },
      },
      limit: 1,
      req,
      overrideAccess: true,
    })

    const styleByClass = existingByClass.docs[0]
    const styleByAlias = existingByAlias.docs[0]

    if (styleByClass && styleByAlias && styleByClass.id !== styleByAlias.id) {
      await req.payload.update({
        collection: 'styles',
        id: styleByAlias.id,
        data: {
          alias,
          className,
          tailwind: false,
          stylesheet,
        },
        req,
        overrideAccess: true,
      })

      await req.payload.delete({
        collection: 'styles',
        id: styleByClass.id,
        req,
        overrideAccess: true,
      })

      return
    }

    const existingStyle = styleByClass || styleByAlias

    if (existingStyle) {
      await req.payload.update({
        collection: 'styles',
        id: existingStyle.id,
        data: {
          alias,
          className,
          tailwind: false,
          stylesheet,
        },
        req,
        overrideAccess: true,
      })

      return
    }

    await req.payload.create({
      collection: 'styles',
      data: {
        alias,
        className,
        tailwind: false,
        stylesheet,
      },
      req,
      overrideAccess: true,
    })
  }

  if (doc.default?.fontData && isFontData(doc.default.fontData) && doc.default.fontData.id) {
    const className = 'font-default'
    const alias = 'Font Default'

    const family = doc.default.fontData.variable
      ? `'${doc.default.fontData.family} Variable', sans-serif`
      : `'${doc.default.fontData.family}', sans-serif`

    const stylesheet = `.${className} {
  font-family: ${family} !important;
  font-weight: ${doc.default.fontData.weight} !important;
  font-style: ${doc.default.fontData.style || 'normal'} !important;
  font-display: swap;
}`

    await upsertFontStyle({
      alias,
      className,
      stylesheet,
    })
  }

  for (const font of additionalFonts) {
    if (font?.title != null && font.title.trim() !== '') {
      const className = `font-${font.id}`
      const stylesheet = generateFontCSS(font)

      await upsertFontStyle({
        alias: font.title,
        className,
        stylesheet,
      })
    }
  }

  const existingStyles = await req.payload.find({
    collection: 'styles',
    where: {
      className: {
        like: 'font-%',
      },
    },
    limit: 1000,
    req,
    overrideAccess: true,
  })

  const fontStyles = existingStyles.docs.filter((style: Style) =>
    style.className.startsWith('font-'),
  )

  const orphanedFontStyles = fontStyles.filter((style: Style) => {
    if (style.className === 'font-default') {
      return false
    }

    const styleId = style.className.replace('font-', '')
    return !currentFontIds.has(styleId)
  })

  for (const style of orphanedFontStyles) {
    await req.payload.delete({
      collection: 'styles',
      id: style.id,
      req,
      overrideAccess: true,
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
    overrideAccess: true,
  })

  for (const fontFile of allFontFiles.docs) {
    if (fontFile.fontId && !activeFontSlugs.has(fontFile.fontId)) {
      await req.payload.delete({
        collection: 'font-files',
        id: fontFile.id,
        req,
        overrideAccess: true,
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
