import { getCachedGlobal } from '@/lib/get-globals'
import { Setting } from '@/payload-types'
import { draftMode } from 'next/headers'

export async function getAppSettings() {
  const { isEnabled } = await draftMode()
  const setting = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const fallbackImage =
    typeof setting.fallbackImage === 'object' ? setting?.fallbackImage?.url : ''
  const favIconPng = typeof setting.favIconPng === 'object' ? setting?.favIconPng?.url : null
  const favIconSvg = typeof setting.favIconSvg === 'object' ? setting?.favIconSvg?.url : null
  const favIcon = typeof setting.favIcon === 'object' ? setting?.favIcon?.url : null

  return {
    appTitle: setting.appTitle,
    appDescription: setting.appDescription,
    fallbackImage,
    favIcon,
    favIconPng,
    favIconSvg,
    googleVerification: setting.googleVerification,
    bingVerification: setting.bingVerification,
    yandexVerification: setting.yandexVerification,
    googleAnalyticsId: setting.googleAnalyticsId,
    microsoftClarityId: setting.microsoftClarityId,
    locale: setting.locale || 'en_CA',
  }
}
