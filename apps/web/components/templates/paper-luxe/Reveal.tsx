'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Delay in milliseconds, for a slow, staggered editorial entrance. */
  delayMs?: number
  style?: CSSProperties
}

/**
 * Quiet reveal for the paper-luxe story: a long, soft fade with a short rise.
 * No spring, no scale, no bounce. `prefers-reduced-motion` renders the finished
 * state immediately.
 */
export default function Reveal({
  children,
  className = '',
  delayMs = 0,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`pl-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{
        ...(delayMs ? { transitionDelay: `${delayMs}ms` } : null),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
