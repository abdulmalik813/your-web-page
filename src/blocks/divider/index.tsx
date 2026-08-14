import { joinStyles } from '@/lib/make-styles'
import { DividerBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function DividerBlockUI({
  pageContext,
  ...dividerBlock
}: DividerBlock & { pageContext: PageContext }) {
  const classNames = joinStyles(dividerBlock.dividerStyles)
  const { type, height, color, flip } = dividerBlock

  const heightMap = {
    small: 'h-8',
    medium: 'h-16',
    large: 'h-24',
    xlarge: 'h-32',
  }

  const colorMap = {
    neutral: 'border-neutral-300 dark:border-neutral-700',
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-500',
  }

  const fillColorMap = {
    neutral: 'fill-neutral-300 dark:fill-neutral-700',
    primary: 'fill-primary-500',
    secondary: 'fill-secondary-500',
    accent: 'fill-accent-500',
  }

  const heightClass = heightMap[height || 'medium']
  const colorClass = colorMap[color || 'neutral']
  const fillClass = fillColorMap[color || 'neutral']
  const flipClass = flip ? 'rotate-180' : ''

  if (type === 'spacer') {
    return <div className={`${heightClass} ${classNames}`} />
  }

  if (type === 'line') {
    return <hr className={`border-t ${colorClass} ${classNames}`} />
  }

  if (type === 'dashed') {
    return <hr className={`border-t border-dashed ${colorClass} ${classNames}`} />
  }

  if (type === 'dotted') {
    return <hr className={`border-t border-dotted ${colorClass} ${classNames}`} />
  }

  if (type === 'double') {
    return (
      <div className={`flex flex-col gap-1 ${classNames}`}>
        <hr className={`border-t ${colorClass}`} />
        <hr className={`border-t ${colorClass}`} />
      </div>
    )
  }

  if (type === 'gradient') {
    return (
      <div
        className={`h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${classNames}`}
      />
    )
  }

  if (type === 'fade') {
    return (
      <div
        className={`${heightClass} bg-gradient-to-b from-transparent to-current opacity-10 ${classNames}`}
      />
    )
  }

  if (type === 'wave') {
    return (
      <div className={`w-full overflow-hidden ${flipClass} ${classNames}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass} ${fillClass}`}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    )
  }

  if (type === 'curve') {
    return (
      <div className={`w-full overflow-hidden ${flipClass} ${classNames}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass} ${fillClass}`}
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
        </svg>
      </div>
    )
  }

  if (type === 'angle') {
    return (
      <div className={`w-full overflow-hidden ${flipClass} ${classNames}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass} ${fillClass}`}
        >
          <path d="M1200 120L0 16.48V0h1200v120z" />
        </svg>
      </div>
    )
  }

  if (type === 'triangle') {
    return (
      <div className={`w-full overflow-hidden ${flipClass} ${classNames}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass} ${fillClass}`}
        >
          <path d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z" />
        </svg>
      </div>
    )
  }

  if (type === 'arrow') {
    return (
      <div className={`w-full overflow-hidden ${flipClass} ${classNames}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass} ${fillClass}`}
        >
          <path d="M649.97 0L550.03 0 599.91 54.12 649.97 0z" />
          <path d="M0,0V6c0,21.6,291,111.46,741,110.26,445.39,3.6,459-88.3,459-110.26V0Z" />
        </svg>
      </div>
    )
  }

  if (type === 'zigzag') {
    return (
      <div className={`w-full overflow-hidden ${flipClass} ${classNames}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass} ${fillClass}`}
        >
          <path d="M0,0 L50,100 L100,0 L150,100 L200,0 L250,100 L300,0 L350,100 L400,0 L450,100 L500,0 L550,100 L600,0 L650,100 L700,0 L750,100 L800,0 L850,100 L900,0 L950,100 L1000,0 L1050,100 L1100,0 L1150,100 L1200,0 V120 H0 Z" />
        </svg>
      </div>
    )
  }

  return <hr className={`border-t ${colorClass} ${classNames}`} />
}
