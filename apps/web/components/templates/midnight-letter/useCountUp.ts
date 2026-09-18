'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 to `target` with an ease-out cubic. Used by the surprise
 * template and reused by the landing preview so both count identically.
 */
export function useCountUp(target: number, enabled: boolean): number {
  const [value, setValue] = useState(enabled ? 0 : target)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return
    }
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [enabled, target])

  return value
}
