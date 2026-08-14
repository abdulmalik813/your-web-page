import type { Metadata } from 'next'
import type { Media, Page, Post, Setting, Social, User } from '@/payload-types'
import { getServerSideURL } from '@/lib/get-url'
import { getAppSettings } from '@/constants/app'
import { getCachedGlobal } from '@/lib/get-globals'

const getImageURL = async (appData: any, image?: Media) => {
  const serverUrl = getServerSideURL()
  let url = appData.fallbackImage

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

const buildContactMetadata = (settings: Setting) => {
  const contactMeta: Record<string, string> = {}

  if (settings.emails && settings.emails.length > 0) {
    contactMeta['contact:email'] = settings.emails.map((e: any) => e.email).join(',')
  }

  if (settings.phones && settings.phones.length > 0) {
    contactMeta['contact:phone_number'] = settings.phones.map((p: any) => p.number).join(',')
  }

  if (settings.addressType === 'partial') {
    contactMeta['contact:locality'] = settings?.locationText || ''
  } else {
    contactMeta['contact:locality'] = settings?.fullAddress?.addressLocality || ''
    contactMeta['contact:region'] = settings?.fullAddress?.addressRegion || ''
    contactMeta['contact:postal_code'] = settings?.fullAddress?.postalCode || ''
    contactMeta['contact:country_name'] = settings?.fullAddress?.addressCountry || ''
  }

  return Object.keys(contactMeta).length > 0 ? contactMeta : undefined
}

export const generateMeta = async (
  doc: Partial<Page> | Partial<Post> | null,
  post: boolean,
  settings: Setting,
): Promise<Metadata> => {
  const appData = await getAppSettings()
  const serverUrl = getServerSideURL()
  const social = (await getCachedGlobal('social')) as Social
  
  const title = doc?.meta?.title ? doc?.meta?.title : appData.appTitle
  const description = doc?.meta?.description || appData.appDescription
  const ogImage = await getImageURL(appData, doc?.meta?.image as Media)
  const slug = doc?.slug === 'home' ? '' : doc?.slug
  const url = `${serverUrl}/${post ? settings.postSlug + '/' : ''}${slug}`

  const contactMetadata = buildContactMetadata(settings)
  
  const author = post && (doc as Post)?.author ? (doc as Post).author as User : null
  const categories = post && (doc as Post)?.categories ? (doc as Post).categories : undefined
  const categoryNames = categories && Array.isArray(categories) 
    ? categories.map((cat) => typeof cat === 'object' ? cat?.name : '').filter(Boolean).join(', ')
    : undefined

  const readingTime = post && (doc as Post)?.readingTime ? (doc as Post).readingTime : 0

  const twitterHandle = social?.x ? social.x.replace('https://twitter.com/', '@').replace('https://x.com/', '@') : undefined

  const publishedTime = post && (doc as Post)?.publishedAt ? new Date((doc as Post).publishedAt!).toISOString() : undefined
  const modifiedTime = post && (doc as Post)?.updatedAt ? new Date((doc as Post).updatedAt!).toISOString() : undefined

  const otherMetadata: Record<string, string> = {
    ...(contactMetadata || {}),
  }

  if (post && readingTime > 0) {
    otherMetadata['twitter:label1'] = 'Reading time'
    otherMetadata['twitter:data1'] = `${readingTime} min read`
  }

  if (post && author) {
    otherMetadata['twitter:label2'] = 'Written by'
    otherMetadata['twitter:data2'] = author.name || ''
  }

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    authors: author ? [{ name: author.name || '' }] : undefined,
    category: categoryNames,
    openGraph: await mergeOpenGraph({
      title,
      description,
      url,
      type: post ? 'article' : 'website',
      publishedTime,
      modifiedTime,
      authors: author ? [author.name || ''] : undefined,
      section: categoryNames,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: twitterHandle,
      site: twitterHandle,
    },

    ...(Object.keys(otherMetadata).length > 0 && { other: otherMetadata }),
  }

  return metadata
}

export const generatePostsListingMeta = async (settings: Setting): Promise<Metadata> => {
  const { postMetaTitle, postMetaDescription, postMetaImage, postSlug } = settings
  const appData = await getAppSettings()
  const serverUrl = getServerSideURL()
  const social = (await getCachedGlobal('social')) as Social
  
  const ogImage = await getImageURL(appData, postMetaImage as Media)
  const title = postMetaTitle || appData.appTitle
  const description = postMetaDescription || appData.appDescription
  const slug = postSlug || 'posts'
  const url = `${serverUrl}/${slug}`

  const contactMetadata = buildContactMetadata(settings)

  const twitterHandle = social?.x ? social.x.replace('https://twitter.com/', '@').replace('https://x.com/', '@') : undefined

  const otherMetadata: Record<string, string> = {
    ...(contactMetadata || {}),
  }

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: await mergeOpenGraph({
      title,
      description,
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: twitterHandle,
      site: twitterHandle,
    },

    ...(Object.keys(otherMetadata).length > 0 && { other: otherMetadata }),
  }

  return metadata
}

const mergeOpenGraph = async (og?: Metadata['openGraph']): Promise<Metadata['openGraph']> => {
  const appData = await getAppSettings()
  const serverUrl = getServerSideURL()

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: appData.appDescription,
    images: [
      {
        url: serverUrl + appData.fallbackImage,
      },
    ],
    siteName: appData.appTitle,
    title: appData.appTitle,
    locale: appData.locale,
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}