'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type RevealVariant = 'up' | 'tilt' | 'scale'

type RevealOnScrollProps = {
  children: ReactNode
  className?: string
  delayMs?: number
  variant?: RevealVariant
  style?: CSSProperties
}

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: 'reveal-up',
  tilt: 'reveal-tilt',
  scale: 'reveal-scale',
}

export default function RevealOnScroll({
  children,
  className = '',
  delayMs = 0,
  variant = 'up',
  style,
}: RevealOnScrollProps) {
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
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${VARIANT_CLASS[variant]} ${visible ? 'is-visible' : ''} ${className}`}
      style={{
        ...(delayMs ? { transitionDelay: `${delayMs}ms` } : null),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
