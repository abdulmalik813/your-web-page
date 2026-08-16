import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting, Style } from '@/payload-types'
import { getCachedDocuments } from '@/lib/get-document'
import { isFontData } from '@/lib/is-font-data'
import { unstable_cache } from 'next/cache'

function collectFontsCSS(setting: Setting): string {
  let css = ''

  if (
    setting.default?.fontData &&
    isFontData(setting.default.fontData) &&
    (setting.default.fontData as any)?.fontCSS
  ) {
    css += ((setting.default.fontData as any)?.fontCSS || '') + '\n\n'
  }

  if (setting.additionalFonts && Array.isArray(setting.additionalFonts)) {
    setting.additionalFonts.forEach((font: any) => {
      if (font.fontData && isFontData(font.fontData) && font.fontData.fontCSS) {
        css += font.fontData.fontCSS + '\n\n'
      }
    })
  }

  return css
}

async function compileStylesheet(draft: boolean) {
  const setting = (await getCachedGlobal('settings', 1, draft)) as Setting
  const styles = (await getCachedDocuments('styles', draft, 10000)) as Style[]

  const fontsourceCSS = collectFontsCSS(setting)

  const stylesCSS = styles
    .map((s) => s.stylesheet || '')
    .filter((css) => css.trim())
    .join('\n\n')

  const css = [fontsourceCSS, setting.theme, stylesCSS].filter(Boolean).join('\n\n')

  return css
}

const getCompiledStylesheet = unstable_cache(
  async () => compileStylesheet(false),
  ['compiled-stylesheet'],
  {
    tags: ['compiled-stylesheet', 'collection-styles'],
  },
)

async function computeEtag(css: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(css))
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16)
}

export async function GET(request: NextRequest) {
  const { isEnabled: draftCookie } = await draftMode()
  const isDraftParam = request.nextUrl.searchParams.has('draft')

  // DATA decision: only serve draft/unpublished CSS when the editor is actually
  // authenticated via the Next.js draft-mode cookie. The ?draft param alone is
  // NOT enough — anyone could append it to get unpublished styles.
  const useDraftData = draftCookie

  // CACHE decision: suppress browser caching for any URL that carries the
  // ?draft param (these URLs are unique per-save and must never be reused).
  const noCache = draftCookie || isDraftParam

  if (noCache) {
    const css = await compileStylesheet(useDraftData)
    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  // Production path: serve from unstable_cache, use ETag for 304 support.
  const css = await getCompiledStylesheet()
  const etag = `"${await computeEtag(css)}"`

  // If the client already has the current version, return 304.
  const ifNoneMatch = request.headers.get('if-none-match')
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        ETag: etag,
      },
    })
  }

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      ETag: etag,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}