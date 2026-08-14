import { PAYLOAD } from '@/constants/init'

export const generatePreviewPath = (path: string = "home") => {

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: PAYLOAD.PREVIEW,
  })

  const url = `/api/draft/enable?${encodedParams.toString()}`

  return url
}