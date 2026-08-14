import { getCachedRedirects } from '@/lib/get-redirects'
import { Setting } from '@/payload-types'
import { getHref } from '@/lib/get-href'
import { redirect } from 'next/navigation'

export async function redirectCheck(slug: string, setting: Setting | null) {
  const redirectMap = await getCachedRedirects()()
  
  const redirectTo = redirectMap[slug]
  
  if (redirectTo) {
    const redirectUrl = getHref(redirectTo, setting)
    redirect(redirectUrl)
  }
}