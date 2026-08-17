import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { generateMeta, generatePostsListingMeta } from '@/lib/generate-meta'
import { joinStyles } from '@/lib/make-styles'
import { cn } from '@/lib/utils'
import { BlockRenderer } from '@/components/renderer/block-renderer'
import { Hero } from '@/components/hero'
import { getCachedGlobal } from '@/lib/get-globals'
import { Page, Post, Setting } from '@/payload-types'
import PostListingPage from '@/components/post-listing'
import { redirectCheck } from '@/lib/redirect'
import { SchemaRenderer } from '@/components/renderer/schema-renderer'
import { PageContext } from '@/types/page-context'
import { Footer } from '@/components/footer'
import { NavigationBarUI } from '@/components/navigation-bar'
import { SlugProps } from '@/types/slug-props'
import { AdminBar } from '@/components/admin-bar'
import { AlertCircle, Home } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/button'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const setting = (await getCachedGlobal('settings', 1, false)) as Setting
  const isPostEnabled = setting.enablePost

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params: { slug: string[] }[] = []

  if (isPostEnabled) {
    const postSlug = setting.postSlug || 'posts'

    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    params.push({ slug: postSlug.split('/').filter(Boolean) })

    posts.docs?.forEach(({ slug }) => {
      const correctSlug = `${postSlug}/${slug}`
      params.push({ slug: correctSlug.split('/').filter(Boolean) })
    })
  }

  pages.docs?.forEach(({ slug }) => {
    params.push({ slug: slug?.split('/').filter(Boolean) || [] })
  })

  params.push({ slug: [] })
  return params
}

// Allow dynamic params for pages not in generateStaticParams (e.g. new pages created after build)
export const dynamicParams = true

const gapClasses = {
  none: 'gap-0',
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6',
  xlarge: 'gap-8',
} as const

const colsSpanClasses = {
  full: 'col-span-4 lg:col-span-12',
  'three-quarters': 'col-span-4 lg:col-span-9',
  'two-thirds': 'col-span-4 lg:col-span-8',
  half: 'col-span-4 lg:col-span-6',
  'one-third': 'col-span-4 lg:col-span-4',
  'one-quarter': 'col-span-4 lg:col-span-3',
}

function isPostRoute(slugArray: string[] | undefined, postSlug: string): boolean {
  if (!slugArray || slugArray.length === 0) return false

  const postSlugParts = postSlug.split('/').filter(Boolean)

  if (slugArray.length < postSlugParts.length) return false

  return postSlugParts.every((part, index) => slugArray[index] === part)
}

function extractPostSlug(slugArray: string[], postSlug: string): string | null {
  const postSlugParts = postSlug.split('/').filter(Boolean)

  if (slugArray.length === postSlugParts.length) {
    return null
  }

  return slugArray.slice(postSlugParts.length).join('/')
}

/**
 * Cached query for static rendering — does NOT call draftMode(),
 * so the page stays statically cacheable.
 */
const queryCachedBySlug = (slug: string, collection: 'pages' | 'posts') =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection,
        draft: false,
        limit: 1,
        pagination: false,
        overrideAccess: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })
      return result.docs?.[0] || null
    },
    [collection, slug],
    {
      tags: [`collection-${collection}`, `${collection}-slug-${slug}`],
    },
  )()

/**
 * Direct query for draft mode — bypasses cache, used only
 * when an editor is previewing unpublished content.
 */
async function queryDraftBySlug(slug: string, collection: 'pages' | 'posts') {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection,
    draft: true,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return result.docs?.[0] || null
}

export default async function PageRoute({ params, searchParams }: Readonly<SlugProps>) {
  const { isEnabled: draft } = await draftMode()
  const setting = (await getCachedGlobal('settings', 1, draft)) as Setting
  const isPostEnabled = setting.enablePost
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  await redirectCheck(slug, setting)
  let page: Post | Page | null = null
  let isPostListingPage = false
  let isItAPost = false

  // Choose the query strategy based on draft mode
  const queryBySlug = draft ? queryDraftBySlug : queryCachedBySlug

  if (isPostEnabled) {
    const postSlug = setting.postSlug || 'posts'

    if (isPostRoute(param?.slug, postSlug)) {
      const postItemSlug = extractPostSlug(param.slug!, postSlug)

      if (postItemSlug === null) {
        isPostListingPage = true
      } else if (postItemSlug) {
        isItAPost = true
        page = await queryBySlug(postItemSlug, 'posts')
      }
    }
  }

  if (!page && !isPostListingPage) {
    page = await queryBySlug(slug, 'pages')
  }

  const pageContext: PageContext = {
    page,
    setting,
    searchParams,
    draft,
    slug,
    isItAPost,
    isPostListingPage,
  }

  return (
    <>
      <AdminBar pageContext={pageContext} />
      <NavigationBarUI pageContext={pageContext} />
      <main className="flex-1">
        <article className="min-h-[70vh]">
          {isPostListingPage ? (
            <>
              <PostListingPage pageContext={pageContext} />
            </>
          ) : page ? (
            <>
              <Hero hero={page.hero} pageContext={pageContext} />
              {page.layout?.map((layout, i) => (
                <div
                  key={i}
                  className={joinStyles(
                    cn(layout.container && 'container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16'),
                    layout.styles,
                  )}
                >
                  <div
                    className={cn(
                      'grid grid-cols-4 lg:grid-cols-12',
                      gapClasses[layout.gapSize || 'medium'],
                    )}
                  >
                    {layout.grid?.map((grid, index) => (
                      <div
                        key={index}
                        className={joinStyles(
                          colsSpanClasses[grid.gridSize],
                          grid.gridStyles,
                          cn({ 'md:col-span-2': grid.gridSize !== 'full' }),
                        )}
                      >
                        {grid.blocks?.map((block, index) => (
                          <BlockRenderer key={index} block={block} pageContext={pageContext} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <article className="min-h-[70vh] flex items-center justify-center px-4">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-destructive/10 p-3">
                      <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold uppercase">404 - Page Not Found</CardTitle>
                  <CardDescription className="text-base mt-2 uppercase">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button asChild className="w-full">
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4 uppercase" />
                      Go to Homepage
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </article>
          )}
          <SchemaRenderer pageContext={pageContext} />
        </article>
      </main>
      <Footer pageContext={pageContext} />
    </>
  )
}

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const setting = (await getCachedGlobal('settings', 1, false)) as Setting
  const isPostEnabled = setting.enablePost
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  let post = false
  let page: Post | Page | null = null

  if (isPostEnabled) {
    const postSlug = setting.postSlug || 'posts'

    if (isPostRoute(param?.slug, postSlug)) {
      const postItemSlug = extractPostSlug(param.slug!, postSlug)

      if (postItemSlug === null) {
        return generatePostsListingMeta(setting)
      } else if (postItemSlug) {
        post = true
        page = await queryCachedBySlug(postItemSlug, 'posts')
      }
    }
  }

  if (!page) {
    page = await queryCachedBySlug(slug, 'pages')
  }

  if (!page) {
    return {
      title: '404 - Page Not Found',
      description: "The page you're looking for doesn't exist or has been moved.",
    }
  }

  return generateMeta(page, post, setting)
}
