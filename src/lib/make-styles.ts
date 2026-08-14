import { Style } from '@/payload-types'

export function joinStyles(
  ...items: (Style | string | undefined | null | (Style | string | number)[])[]
): string {
  let mapClass = ''
  let stringClass = ''

  for (const item of items) {
    if (Array.isArray(item)) {
      mapClass +=
        ' ' +
        item
          .map((i) =>
            typeof i === 'object' && i !== null && i.className
              ? i.className
                  .split(' ')
                  .map((cls) => cls.trim())
                  .filter((cls) => cls !== '')
                  .map((cls) => sanitizeAlias(i.alias, cls))
                  .join(' ')
              : i,
          )
          .filter(Boolean)
          .join(' ')
    } else if (typeof item === 'string') {
      stringClass += ` ${item}`
    }
  }

  const trimmedStringClass = stringClass.trim()
  const trimmedMapClass = mapClass.trim()

  return [trimmedStringClass, trimmedMapClass].filter(Boolean).join(' ')
}

function sanitizeAlias(alias: string, cls: string): string {
  if (cls.startsWith('font-')) return cls

  const sanitized = alias
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  if (!sanitized) {
    return `item-${cls}`;
  }
  
  if (/^[0-9-]/.test(sanitized)) {
    return `c${sanitized}-${cls}`;
  }
  
  return `${sanitized}-${cls}`;
}