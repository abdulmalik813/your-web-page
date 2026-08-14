import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Footer } from '@/components/footer'
import { NavigationBarUI } from '@/components/nav-menu/navigation-bar'
import { PageContext } from '@/types/page-context'
import { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/get-globals'
import { draftMode } from 'next/headers'
import { SlugProps } from '@/types/slug-props'
import { AdminBar } from '@/components/admin-bar'
import { Metadata } from 'next'

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const setting = (await getCachedGlobal('settings', 1, false)) as Setting
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  const siteName = setting.appTitle || 'Loading...'
  const title = slug === 'home' ? `Loading | ${siteName}` : `Loading - ${slug} | ${siteName}`

  return {
    title,
    description: 'Loading content...',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function Loading({ params, searchParams }: Readonly<SlugProps>) {
  const param = await params
  const page = null
  const { isEnabled: draft } = await draftMode()
  const setting = (await getCachedGlobal('settings', 1, draft)) as Setting
  const slug = param?.slug ? param.slug.join('/') : 'home'

  const pageContext: PageContext = {
    page,
    setting,
    searchParams,
    draft,
    slug,
  }

  return (
    <>
      <AdminBar pageContext={pageContext} />
      <NavigationBarUI pageContext={pageContext} />
      <main className="flex-1">
        <article className="min-h-[70vh]">
          <div className="w-full h-64 bg-muted animate-pulse mb-8" />

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 lg:grid-cols-12 gap-4">
              <div className="col-span-4 lg:col-span-8 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />

                <div className="pt-6 space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>

              <div className="col-span-4 space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </article>
      </main>
      <Footer pageContext={pageContext} />
    </>
  )
}
