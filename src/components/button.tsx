import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button as BaseButton } from '@/components/ui/button'

const extendedSizes = {
  xl: 'h-12 rounded-md px-8 text-base gap-2.5 has-[>svg]:px-6',
  '2xl': 'h-14 rounded-md px-10 text-lg gap-3 has-[>svg]:px-8',
  '3xl': 'h-16 rounded-md px-12 text-xl gap-3 has-[>svg]:px-10',
  '4xl': 'h-20 rounded-md px-16 text-2xl gap-4 has-[>svg]:px-12',
} as const

type BaseButtonSize =
  | 'default'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-sm'
  | 'icon-lg'

type ExtendedButtonSize = keyof typeof extendedSizes

type ButtonSize = BaseButtonSize | ExtendedButtonSize

type ButtonProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  'size'
> & {
  size?: ButtonSize
}

function Button({
  className,
  size = 'default',
  ...props
}: ButtonProps) {
  const isExtendedSize = size in extendedSizes

  const baseSize: BaseButtonSize = isExtendedSize
    ? 'default'
    : (size as BaseButtonSize)

  return (
    <BaseButton
      size={baseSize}
      className={cn(
        isExtendedSize &&
          extendedSizes[size as ExtendedButtonSize],
        className,
      )}
      {...props}
    />
  )
}

export { Button }