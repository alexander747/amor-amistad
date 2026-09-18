'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Distance travelled on the Y axis. */
  y?: number
  /** Initial scale for a "pop" entrance. */
  from?: number
}

/**
 * Neon entrance: spring pop when the element enters the viewport. Under
 * `prefers-reduced-motion` it renders the finished state with no animation.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 26,
  from = 0.96,
}: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: from }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: 'spring',
        stiffness: 210,
        damping: 24,
        mass: 0.9,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
