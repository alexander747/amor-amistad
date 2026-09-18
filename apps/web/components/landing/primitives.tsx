'use client'

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { formatNumber } from '@/lib/dates'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Starting offset in px. 0 keeps it a pure fade. */
  y?: number
}

/**
 * Scroll-triggered reveal. Falls back to a plain, static wrapper when the
 * visitor prefers reduced motion (JS transforms are not covered by the CSS
 * media query).
 */
export function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

type CountUpProps = {
  value: number
  className?: string
  suffix?: string
}

/** Counts up once the number scrolls into view. */
export function CountUp({ value, className, suffix = '' }: CountUpProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const count = useMotionValue(reduce ? value : 0)
  const display = useTransform(count, (latest) =>
    `${formatNumber(Math.round(latest))}${suffix}`,
  )

  useEffect(() => {
    if (reduce) {
      count.set(value)
      return
    }
    if (!inView) return
    const controls = animate(count, value, { duration: 1.6, ease: EASE_OUT })
    return () => controls.stop()
  }, [count, inView, reduce, value])

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </span>
  )
}

type OutlineNumberProps = {
  value: string
  className?: string
}

/** Oversized outline numeral used as decorative structure. */
export function OutlineNumber({ value, className = '' }: OutlineNumberProps) {
  return (
    <span aria-hidden="true" className={`text-outline-soft font-display leading-none ${className}`}>
      {value}
    </span>
  )
}

type SectionLabelProps = {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span className={`inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-accent)] ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-[var(--color-accent)] opacity-60" />
      {children}
    </span>
  )
}
