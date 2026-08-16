import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type {
  Page,
  Media,
  User,
  Social,
  Setting,
  Post,
  Thumbnail,
  Faq,
  Testimonial,
} from '@/payload-types'
import { getMediaUrl } from '@/lib/get-media-url'
import { mediaExtractor } from '@/lib/image-extractor'
import { getCachedDocuments } from '@/lib/get-document'
import { checkBlock } from '@/lib/check-block'

const buildPersonSchema = (author: User, socialLinks: string[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name || '',
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  }
}

const buildWebSiteSchema = (setting: Setting) => {
  const serverUrl = getServerSideURL()
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: setting.appTitle || '',
    url: serverUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${serverUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

const buildLocalBusinessSchema = async (setting: Setting, social: Social, pageImage?: Media) => {
  const hasContactInfo = 
    (setting.emails && setting.emails.length > 0) ||
    (setting.phones && setting.phones.length > 0) ||
    setting.locationText ||
    setting.fullAddress

  if (!hasContactInfo) {
    return null
  }

  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link) as string[]

  const imageToUse = pageImage || (setting.fallbackImage as Media)
  const imageUrl = imageToUse?.url ? getMediaUrl(imageToUse.url) : undefined

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: setting.appTitle || '',
    description: setting.appDescription || undefined,
    priceRange: '$',
  }

  if (imageUrl) {
    schema.image = imageUrl
  }

  if (setting.emails && setting.emails.length > 0) {
    schema.email = setting.emails.map((e: any) => e.email)
  }

  if (setting.phones && setting.phones.length > 0) {
    schema.telephone = setting.phones.map((p: any) => p.number)
  }

  if (setting.addressType == "full") {
    if (setting.fullAddress && (
      setting.fullAddress.streetAddress ||
      setting.fullAddress.addressLocality ||
      setting.fullAddress.postalCode
    )) {
      schema.address = {
        '@type': 'PostalAddress',
        ...(setting.fullAddress.streetAddress && { streetAddress: setting.fullAddress.streetAddress }),
        ...(setting.fullAddress.addressLocality && { addressLocality: setting.fullAddress.addressLocality }),
        ...(setting.fullAddress.addressRegion && { addressRegion: setting.fullAddress.addressRegion }),
        ...(setting.fullAddress.postalCode && { postalCode: setting.fullAddress.postalCode }),
        ...(setting.fullAddress.addressCountry && { addressCountry: setting.fullAddress.addressCountry }),
      }
    }
  } else if (setting.locationText) {
    schema.address = setting.locationText
  }

  if (setting.googleMapsId) {
    schema.hasMap = `https://www.google.com/maps/place/?q=place_id:${setting.googleMapsId}`
  }

  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks
  }

  return schema
}

const buildOrganizationSchema = async (setting: Setting, social: Social) => {
  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link) as string[]

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: setting.appTitle || '',
    description: setting.appDescription || undefined,
    url: getServerSideURL(),
    logo: await imageSchema(setting.logo as Media, setting),
  }

  if (setting.emails && setting.emails.length > 0) {
    schema.email = setting.emails.map((e: any) => e.email)
  }

  if (setting.phones && setting.phones.length > 0) {
    schema.telephone = setting.phones.map((p: any) => p.number)
  }

  if (setting.addressType == "full") {
    if (setting.fullAddress && (
      setting.fullAddress.streetAddress ||
      setting.fullAddress.addressLocality ||
      setting.fullAddress.postalCode
    )) {
      schema.address = {
        '@type': 'PostalAddress',
        ...(setting.fullAddress.streetAddress && { streetAddress: setting.fullAddress.streetAddress }),
        ...(setting.fullAddress.addressLocality && { addressLocality: setting.fullAddress.addressLocality }),
        ...(setting.fullAddress.addressRegion && { addressRegion: setting.fullAddress.addressRegion }),
        ...(setting.fullAddress.postalCode && { postalCode: setting.fullAddress.postalCode }),
        ...(setting.fullAddress.addressCountry && { addressCountry: setting.fullAddress.addressCountry }),
      }
    }
  } else if (setting.locationText) {
    schema.address = setting.locationText
  }

  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks
  }

  const fallbackImageUrl = (setting.fallbackImage as Media)?.url
  if (fallbackImageUrl) {
    schema.image = getMediaUrl(fallbackImageUrl)
  }

  return schema
}

const faqSchema = async (page: Page | Post) => {
  if (!checkBlock(page, 'faqBlock')) return null
  const faqs = (await getCachedDocuments('faqs')) as Faq[]

  if (!faqs || faqs.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

const testimonialSchema = async (page: Page | Post, setting: Setting) => {
  if (!checkBlock(page, 'testimonialBlock')) return null
  const testimonials = (await getCachedDocuments('testimonials')) as Testimonial[]

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const testimonialsWithRatings = testimonials.filter((t) => t.rating)
  const ratingCount = testimonialsWithRatings.length
  const ratingSum = testimonialsWithRatings.reduce((sum, t) => sum + (t.rating || 0), 0)
  const averageRating = ratingCount > 0 ? ratingSum / ratingCount : null

  const reviews = testimonials.map((testimonial) => {
    const author =
      testimonial.type === 'company'
        ? {
            '@type': 'Organization' as const,
            name: testimonial.company || testimonial.name,
          }
        : {
            '@type': 'Person' as const,
            name: testimonial.name,
            ...(testimonial.position && { jobTitle: testimonial.position }),
            ...(testimonial.company && {
              worksFor: {
                '@type': 'Organization' as const,
                name: testimonial.company,
              },
            }),
          }

    const review: any = {
      '@type': 'Review',
      author,
    }

    if (testimonial.content) {
      review.reviewBody = testimonial.content
    }

    if (testimonial.rating) {
      review.reviewRating = {
        '@type': 'Rating',
        ratingValue: testimonial.rating,
        bestRating: 5,
      }
    }

    return review
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: setting.appTitle || '',
    ...(averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: ratingCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    review: reviews,
  }
}

export const pageSchema = async (page: Page, setting: Setting) => {
  const social = (await getCachedGlobal('social')) as Social
  const medias = mediaExtractor(page)

  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link) as string[]

  const associatedMediaSchemas = await Promise.all(
    medias.map((media) => mediaSchema(media as Media, setting)),
  ).then((schemas) => schemas.filter(Boolean))

  const isHomePage = page.slug === 'home'
  const slugParts = isHomePage ? [] : page.slug.split('/').filter(Boolean)

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: getServerSideURL(),
      '@id': getServerSideURL(),
    },
  ]

  if (!isHomePage) {
    let currentPath = ''
    slugParts.forEach((part, index) => {
      currentPath += `/${part}`
      const itemUrl = `${getServerSideURL()}${currentPath}`
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: index + 2,
        name: part
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        item: itemUrl,
        '@id': itemUrl,
      })
    })
  }

  const publishDate = page?.publishedAt || page?.createdAt
  const modifyDate = page?.updatedAt

  const faqData = await faqSchema(page)
  const testimonialData = await testimonialSchema(page, setting)

  const pageUrl = isHomePage ? getServerSideURL() : `${getServerSideURL()}/${page?.slug}`

  const pageImage = page.meta?.image as Media
  const fallbackImage = setting.fallbackImage as Media
  const imageUrl = pageImage?.url || fallbackImage?.url

  const schemas = []

  const webPageSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page?.meta?.title || page?.title || undefined,
    description: page?.meta?.description || undefined,
    url: pageUrl,
    datePublished: publishDate ? new Date(publishDate).toISOString() : undefined,
    dateModified: modifyDate ? new Date(modifyDate).toISOString() : undefined,
    image: await imageSchema(pageImage, setting),
    thumbnailUrl: imageUrl ? getMediaUrl(imageUrl) : undefined,
    associatedMedia: associatedMediaSchemas.length > 0 ? associatedMediaSchemas : undefined,
    author: page?.author
      ? {
          '@type': 'Person',
          name: (page.author as User)?.name || undefined,
          sameAs: socialLinks.length > 0 ? socialLinks : undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: setting.appTitle || undefined,
      logo: await imageSchema(setting.logo as Media, setting),
    },
  }

  schemas.push(webPageSchema)

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  })

  if (page?.author) {
    const author = page.author as User
    schemas.push(buildPersonSchema(author, socialLinks))
  }

  if (faqData) {
    schemas.push(faqData)
  }

  if (testimonialData) {
    schemas.push(testimonialData)
  }

  const localBusinessSchema = await buildLocalBusinessSchema(setting, social, pageImage)
  if (localBusinessSchema) {
    schemas.push(localBusinessSchema)
  } else {
    const organizationSchema = await buildOrganizationSchema(setting, social)
    schemas.push(organizationSchema)
  }

  const websiteSchema = buildWebSiteSchema(setting)
  schemas.push(websiteSchema)

  return schemas.length === 1 ? schemas[0] : schemas
}

export const blogSchema = async (post: Post, setting: Setting) => {
  const social = (await getCachedGlobal('social')) as Social
  const medias = mediaExtractor(post)

  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link) as string[]

  const associatedMediaSchemas = await Promise.all(
    medias.map((media) => mediaSchema(media as Media, setting)),
  ).then((schemas) => schemas.filter(Boolean))

  const publishDate = post?.publishedAt || post?.createdAt
  const modifyDate = post?.updatedAt

  const faqData = await faqSchema(post)
  const testimonialData = await testimonialSchema(post, setting)

  const postImage = post.meta?.image as Media
  const fallbackImage = setting.fallbackImage as Media
  const imageUrl = postImage?.url || fallbackImage?.url

  const categories = post.categories
  const categoryNames = categories && Array.isArray(categories)
    ? categories.map((cat: any) => (typeof cat === 'object' ? cat?.name : '')).filter(Boolean)
    : []

  const schemas = []

  const homeUrl = getServerSideURL()
  const blogUrl = `${getServerSideURL()}/${setting.postSlug}`
  const postUrl = `${getServerSideURL()}/${setting.postSlug}/${post?.slug}`

  const blogPostSchema: any = {
    '@context': 'https://schema.org',
    '@type': ['BlogPosting', 'Article'],
    headline: post?.meta?.title || post?.title || undefined,
    description: post?.meta?.description || undefined,
    datePublished: publishDate ? new Date(publishDate).toISOString() : undefined,
    dateModified: modifyDate ? new Date(modifyDate).toISOString() : undefined,
    image: await imageSchema(postImage, setting),
    thumbnailUrl: imageUrl ? getMediaUrl(imageUrl) : undefined,
    associatedMedia: associatedMediaSchemas.length > 0 ? associatedMediaSchemas : undefined,
    author: {
      '@type': 'Person',
      name: (post.author as User)?.name || undefined,
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: setting.appTitle || undefined,
      logo: await imageSchema(setting.logo as Media, setting),
    },
    url: postUrl,
    ...(categoryNames.length > 0 && { 
      articleSection: categoryNames,
      keywords: categoryNames.join(', ')
    }),
  }

  schemas.push(blogPostSchema)

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: homeUrl,
        '@id': homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: setting.postListingPageTitle || 'Blog',
        item: blogUrl,
        '@id': blogUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post?.title || undefined,
        item: postUrl,
        '@id': postUrl,
      },
    ],
  })

  if (post?.author) {
    const author = post.author as User
    schemas.push(buildPersonSchema(author, socialLinks))
  }

  if (faqData) {
    schemas.push(faqData)
  }

  if (testimonialData) {
    schemas.push(testimonialData)
  }

  const localBusinessSchema = await buildLocalBusinessSchema(setting, social, postImage)
  if (localBusinessSchema) {
    schemas.push(localBusinessSchema)
  } else {
    const organizationSchema = await buildOrganizationSchema(setting, social)
    schemas.push(organizationSchema)
  }

  const websiteSchema = buildWebSiteSchema(setting)
  schemas.push(websiteSchema)

  return schemas.length === 1 ? schemas[0] : schemas
}

export const imageSchema = async (image: Media | null | undefined, setting: Setting) => {
  let imageToUse = null
  if (!image || !image.url) {
    imageToUse = setting.fallbackImage as Media
  } else {
    imageToUse = image
  }

  if (!imageToUse || !imageToUse.url) {
    return undefined
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: getMediaUrl(imageToUse.url),
    url: getMediaUrl(imageToUse.url),
    name: imageToUse?.alt || imageToUse?.filename || undefined,
    description: imageToUse?.caption || undefined,
    width: imageToUse?.width || undefined,
    height: imageToUse?.height || undefined,
    thumbnail: imageToUse?.sizes?.thumbnail?.url
      ? {
          '@type': 'ImageObject',
          contentUrl: getMediaUrl(imageToUse.sizes.thumbnail.url),
          width: imageToUse.sizes.thumbnail.width || undefined,
          height: imageToUse.sizes.thumbnail.height || undefined,
        }
      : undefined,
    creditText: imageToUse?.creditText || undefined,
    creator: imageToUse?.creator
      ? {
          '@type': 'Person',
          name: imageToUse.creator,
        }
      : undefined,
    license: imageToUse?.license || undefined,
    copyrightNotice: imageToUse?.copyrightNotice || undefined,
    acquireLicensePage: imageToUse?.acquireLicensePage || undefined,
    uploadDate: imageToUse?.createdAt ? new Date(imageToUse?.createdAt).toISOString() : undefined,
    encodingFormat: imageToUse?.mimeType || undefined,
  }
}

export const mediaSchema = async (media: Media | null | undefined, setting: Setting) => {
  if (!media || !media.url) {
    return null
  }

  const isVideo = media.mimeType?.startsWith('video/')
  const isImage = media.mimeType?.startsWith('image/')
  const isAudio = media.mimeType?.startsWith('audio/')

  const uploadDate = media?.createdAt

  const baseSchema = {
    '@context': 'https://schema.org',
    contentUrl: getMediaUrl(media.url),
    url: getMediaUrl(media.url),
    name: media.alt || media.filename || undefined,
    description: media.caption || undefined,
    encodingFormat: media.mimeType || undefined,
    contentSize: media.filesize ? `${media.filesize}` : undefined,
    width: media.width || undefined,
    height: media.height || undefined,
    uploadDate: uploadDate ? new Date(uploadDate).toISOString() : undefined,
    creditText: media.creditText || undefined,
    creator: media?.creator
      ? {
          '@type': 'Person',
          name: media.creator,
        }
      : undefined,
    license: media.license || undefined,
    copyrightNotice: media.copyrightNotice || undefined,
    acquireLicensePage: media.acquireLicensePage || undefined,
  }

  if (isVideo) {
    const videoThumbnail =
      (media.videoThumbnail as Thumbnail) || (setting.fallbackImage as Media) || null
    return {
      ...baseSchema,
      '@type': 'VideoObject',
      thumbnailUrl: videoThumbnail
        ? getMediaUrl(
            videoThumbnail?.thumbnailURL ||
              videoThumbnail?.sizes?.thumbnail?.url ||
              videoThumbnail?.url,
          )
        : undefined,
      thumbnail:
        videoThumbnail.thumbnailURL || videoThumbnail?.sizes?.thumbnail?.url || videoThumbnail?.url
          ? {
              '@type': 'ImageObject',
              contentUrl: getMediaUrl(
                videoThumbnail.thumbnailURL || videoThumbnail?.sizes?.thumbnail?.url || '',
              ),
              width: videoThumbnail?.sizes?.thumbnail?.width || undefined,
              height: videoThumbnail?.sizes?.thumbnail?.height || undefined,
            }
          : undefined,
    }
  }

  if (isAudio) {
    return {
      ...baseSchema,
      '@type': 'AudioObject',
    }
  }

  if (isImage) {
    return {
      ...baseSchema,
      '@type': 'ImageObject',
      thumbnail: media.sizes?.thumbnail?.url
        ? {
            '@type': 'ImageObject',
            contentUrl: getMediaUrl(media.sizes.thumbnail.url),
            width: media.sizes.thumbnail.width || undefined,
            height: media.sizes.thumbnail.height || undefined,
          }
        : undefined,
      thumbnailUrl: media.sizes?.thumbnail?.url
        ? getMediaUrl(media.sizes.thumbnail.url)
        : undefined,
    }
  }

  return {
    ...baseSchema,
    '@type': 'MediaObject',
  }
}

export const postListingSchema = async (setting: Setting, social?: Social) => {
  const socialData = social || ((await getCachedGlobal('social')) as Social)

  const socialLinks = [
    socialData.facebook,
    socialData.instagram,
    socialData.linkedin,
    socialData.x,
    socialData.youtube,
    socialData.tiktok,
  ].filter((link) => link) as string[]

  const postMetaImage = setting.postMetaImage as Media
  const fallbackImage = setting.fallbackImage as Media
  const imageUrl = postMetaImage?.url || fallbackImage?.url

  const homeUrl = getServerSideURL()
  const postsUrl = `${getServerSideURL()}/${setting.postSlug}`

  const schemas = []

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: setting.postListingPageTitle || 'Posts',
    description: setting.postMetaDescription || undefined,
    url: postsUrl,
    image: await imageSchema(postMetaImage, setting),
    thumbnailUrl: imageUrl ? getMediaUrl(imageUrl) : undefined,
    publisher: {
      '@type': 'Organization',
      name: setting.appTitle || undefined,
      logo: await imageSchema(setting.logo as Media, setting),
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
  })

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: homeUrl,
        '@id': homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: setting.postListingPageTitle || 'Posts',
        item: postsUrl,
        '@id': postsUrl,
      },
    ],
  })

  const localBusinessSchema = await buildLocalBusinessSchema(setting, socialData, postMetaImage)
  if (localBusinessSchema) {
    schemas.push(localBusinessSchema)
  } else {
    const organizationSchema = await buildOrganizationSchema(setting, socialData)
    schemas.push(organizationSchema)
  }

  const websiteSchema = buildWebSiteSchema(setting)
  schemas.push(websiteSchema)

  return schemas.length === 1 ? schemas[0] : schemas
}