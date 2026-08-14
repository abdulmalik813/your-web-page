'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimateProps {
  animate?: {
    type?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | null
    duration?: number | null
    delay?: number | null
    animateOnScroll?: boolean | null
    animateOnce?: boolean | null
    viewportAmount?: number | null
  } | null
  children: ReactNode
  className?: string
}

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
}

export function AnimateWrapper({ animate, children, className }: AnimateProps) {
  if (!animate || !animate.type || animate.type === 'none') {
    return <div className={className}>{children}</div>
  }

  const {
    type = 'fadeIn',
    duration = 0.5,
    delay = 0,
    animateOnScroll = true,
    animateOnce = true,
    viewportAmount = 0.3,
  } = animate

  const variants = animationVariants[type]

  if (animateOnScroll) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: animateOnce ?? true, amount: viewportAmount ?? 0.3 }}
        variants={variants}
        transition={{ duration: duration ?? 0.5, delay: delay ?? 0 }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: duration ?? 0.5, delay: delay ?? 0 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}