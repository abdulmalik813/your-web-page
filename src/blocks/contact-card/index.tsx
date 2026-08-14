import { ContactCardBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { Mail, Phone, MapPin } from 'lucide-react'
import { joinStyles } from '@/lib/make-styles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export function ContactCardBlockUI({
  pageContext,
  ...contactCardBlock
}: ContactCardBlock & { pageContext: PageContext }) {
  if (!contactCardBlock || typeof contactCardBlock !== 'object') {
    return null
  }

  const fullAddressString = pageContext.setting.fullAddress
    ? [
        pageContext.setting.fullAddress.streetAddress,
        pageContext.setting.fullAddress.addressLocality,
        pageContext.setting.fullAddress.addressRegion,
        pageContext.setting.fullAddress.postalCode,
        pageContext.setting.fullAddress.addressCountry,
      ]
        .filter(Boolean)
        .join(', ')
    : ''

  const displayAddress =
    pageContext.setting.addressType === 'partial'
      ? pageContext.setting.locationText || ''
      : fullAddressString

  const mapUrl = displayAddress
    ? `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodeURIComponent(displayAddress)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`
    : ''

  return (
    <Card className={joinStyles(contactCardBlock.cardStyles)}>
      <CardHeader>
        <CardTitle className={joinStyles(contactCardBlock.headingStyles)}>
          {contactCardBlock.heading}
        </CardTitle>
        {contactCardBlock.description && (
          <CardDescription className={joinStyles(contactCardBlock.descriptionStyles)}>
            {contactCardBlock.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className={joinStyles(contactCardBlock.contentStyles)}>
        <div className="flex flex-wrap gap-6">
          {pageContext.setting.emails && pageContext.setting.emails.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-primary" />
                Email
              </div>
              <div className="flex flex-col gap-2">
                {pageContext.setting.emails.map((email) => (
                  <Link
                    key={email.id}
                    href={`mailto:${email.email}`}
                    className={joinStyles(contactCardBlock.linkStyles, 'break-words')}
                  >
                    {email.email}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {pageContext.setting.phones && pageContext.setting.phones.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-primary" />
                Phone
              </div>
              <div className="flex flex-col gap-2">
                {pageContext.setting.phones.map((phone) => (
                  <Link
                    key={phone.id}
                    href={`tel:${phone.number.replace(/\s/g, '')}`}
                    className={joinStyles(contactCardBlock.linkStyles, 'break-words')}
                  >
                    {phone.number}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {displayAddress && (
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </div>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={joinStyles(contactCardBlock.linkStyles, 'break-words')}
              >
                {displayAddress}
              </Link>
            </div>
          )}
        </div>
      </CardContent>

      {mapUrl && (
        <div className="relative h-[400px]">
          <iframe
            src={mapUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </Card>
  )
}