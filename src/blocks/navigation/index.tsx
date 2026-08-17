import { NavigationBlock } from '@/payload-types'
import { Button } from '@/components/button'
import { joinStyles } from '@/lib/make-styles'
import Link from 'next/link'
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { IconRender } from '@/components/renderer/icon-renderer'
import { getHref } from '@/lib/get-href'
import { PageContext } from '@/types/page-context'

function getIconData(item: any) {
  const icon = typeof item?.icon === 'object' ? item?.icon : null
  const iconStyles = item?.iconStyles
  const iconPlacement = item?.axis
  const hasIcon = icon?.name != '' && icon?.name != null

  const renderIcon = () => {
    if (!hasIcon) return null

    return (
      <IconRender
        icon={icon.name ?? ''}
        iconStyles={joinStyles(iconStyles)}
      />
    )
  }

  return {
    hasIcon,
    iconPlacement,
    renderIcon,
  }
}

function normalizePath(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return null
  }

  const pathname = path.split('?')[0]?.split('#')[0] || '/'

  if (pathname === '/') {
    return '/'
  }

  return `/${pathname.replace(/^\/+|\/+$/g, '')}`
}

function getCurrentPath(pageContext: PageContext) {
  if (!pageContext.slug || pageContext.slug === 'home') {
    return '/'
  }

  return `/${pageContext.slug.replace(/^\/+|\/+$/g, '')}`
}

function isHrefActive(
  href: string,
  pageContext: PageContext,
) {
  const normalizedHref = normalizePath(href)

  if (!normalizedHref) {
    return false
  }

  return normalizedHref === getCurrentPath(pageContext)
}

type DropdownItem =
  NonNullable<
    NonNullable<NavigationBlock['nav']>['items']
  >[number]

type LinkItem = {
  link?: {
    type?: ('reference' | 'custom' | 'postListingPage') | null
    newTab?: boolean | null
  }
  icon?: any
  iconStyles?: any
  placement?: string | null
  axis?: string | null
  label?: string | null
}

function LinkWithIcon({
  href,
  item,
  label,
  className = '',
  dropdownItem = false,
}: Readonly<{
  href: string
  item: LinkItem
  label: string
  className?: string
  dropdownItem?: boolean
}>) {
  const isExternal = item?.link?.type === 'custom'

  const relProps = item?.link?.newTab
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {}

  const {
    hasIcon,
    iconPlacement,
    renderIcon,
  } = getIconData(item)

  return (
    <Link
      href={href}
      {...relProps}
      className={joinStyles(
        className,
        'min-w-0',
        hasIcon
          ? dropdownItem
            ? 'flex flex-row items-center gap-2'
            : 'flex items-center gap-2'
          : '',
      )}
      prefetch={isExternal ? false : true}
    >
      {iconPlacement !== 'after' && renderIcon()}

      <span className="wrap-break-word whitespace-normal">
        {label}
      </span>

      {iconPlacement === 'after' && renderIcon()}
    </Link>
  )
}

export function NavigationBlockUI({
  pageContext,
  dropdownItem,
  className,
  ...navigationBlock
}: Omit<Partial<NavigationBlock>, 'blockType'> & {
  className?: string
  dropdownItem?: DropdownItem
  pageContext: PageContext
}) {
  const {
    hasIcon,
    iconPlacement,
    renderIcon,
  } = getIconData(navigationBlock.nav)

  if (
    navigationBlock.nav?.appearance === 'button' ||
    navigationBlock.nav?.appearance === 'link'
  ) {
    const href = getHref(
      navigationBlock.nav.link,
      pageContext.setting,
    )

    if (!href) {
      return null
    }

    const active = isHrefActive(
      href,
      pageContext,
    )

    if (navigationBlock.nav.appearance === 'button') {
      return (
        <Button
          asChild
          className={joinStyles(
            className,
            navigationBlock.nav.styles,
            active ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
          )}
          size={
            navigationBlock.nav.buttonSize ??
            'default'
          }
          variant={navigationBlock.nav.buttonType}
        >
          <LinkWithIcon
            href={href}
            item={navigationBlock.nav}
            label={
              navigationBlock.nav.label ?? ''
            }
          />
        </Button>
      )
    }

    return (
      <LinkWithIcon
        href={href}
        item={navigationBlock.nav}
        label={
          navigationBlock.nav.label ?? ''
        }
        className={joinStyles(
          className,
          navigationBlock.nav.styles,
          active ? 'font-semibold text-primary' : '',
        )}
      />
    )
  }

  if (dropdownItem) {
    const href = getHref(
      dropdownItem,
      pageContext.setting,
    )

    if (!href) {
      return null
    }

    const active = isHrefActive(
      href,
      pageContext,
    )

    return (
      <LinkWithIcon
        href={href}
        item={dropdownItem}
        label={dropdownItem.label ?? ''}
        className={joinStyles(
          className,
          active ? 'bg-accent text-accent-foreground' : '',
        )}
        dropdownItem
      />
    )
  }

  const dropdownActive =
    navigationBlock.nav?.items?.some((item) => {
      const href = getHref(
        item,
        pageContext.setting,
      )

      if (!href) {
        return false
      }

      return isHrefActive(
        href,
        pageContext,
      )
    }) ?? false

  return (
    <DropdownMenu>
      <Button
        asChild
        className={joinStyles(
          className,
          navigationBlock.nav?.styles,
          dropdownActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
        )}
        size={
          navigationBlock.nav?.buttonSize ??
          'default'
        }
        variant={
          navigationBlock.nav?.buttonType
        }
      >
        <DropdownMenuTrigger
          className={
            hasIcon
              ? 'flex items-center gap-2'
              : ''
          }
        >
          {iconPlacement !== 'after' &&
            renderIcon()}

          <span className="wrap-break-word whitespace-normal">
            {navigationBlock.nav?.label}
          </span>

          {iconPlacement === 'after' &&
            renderIcon()}
        </DropdownMenuTrigger>
      </Button>

      <DropdownMenuContent
        className={joinStyles(
          navigationBlock.nav?.listStyle,
        )}
      >
        {navigationBlock.nav?.items?.map(
          (item) => {
            const href = getHref(
              item,
              pageContext.setting,
            )

            if (!href) {
              return null
            }

            const active = isHrefActive(
              href,
              pageContext,
            )

            return (
              <DropdownMenuItem
                key={item.id}
                asChild
                className={joinStyles(
                  active ? 'bg-accent text-accent-foreground' : '',
                )}
              >
                <LinkWithIcon
                  href={href}
                  item={item}
                  label={item.label ?? ''}
                  dropdownItem
                />
              </DropdownMenuItem>
            )
          },
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}