'use client'

import type { EventType } from '@/lib/types'

/**
 * Registro best-effort de eventos desde el cliente.
 * Nunca debe romper la experiencia del receptor.
 */
export function trackEvent(slug: string, type: EventType): void {
  if (typeof window === 'undefined') return
  try {
    const body = JSON.stringify({ slug, type })
    if ('sendBeacon' in navigator) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/events', blob)
      return
    }
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined)
  } catch {
    // silencio intencional
  }
}
