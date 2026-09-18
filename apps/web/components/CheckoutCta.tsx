'use client'

import type { ReactNode } from 'react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

type CheckoutCtaProps = {
  href: string
  children: ReactNode
  className?: string
  eventName?: 'InitiateCheckout' | 'Purchase'
}

export default function CheckoutCta({
  href,
  children,
  className = 'btn btn-brass',
  eventName = 'InitiateCheckout',
}: CheckoutCtaProps) {
  const handleClick = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className} rel="noopener">
      {children}
    </a>
  )
}
