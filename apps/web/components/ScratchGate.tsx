'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

/**
 * Colors used to paint the scratch cover. Every template passes its own palette
 * so the cover matches the story behind it. Omitting it keeps the brass look.
 */
export type ScratchCover = {
  from: string
  mid: string
  to: string
  /** Mid-stop color of the diagonal foil sheen. */
  sheen?: string
  /** Hairline frame color. */
  frame?: string
}

type ScratchGateProps = {
  onReveal?: () => void
  label?: string
  hint?: string
  revealButtonLabel?: string
  /** Content shown behind the scratch layer while it is still covered. */
  backdrop?: React.ReactNode
  /** 0..1 fraction of the card that must be scratched to auto-reveal. */
  threshold?: number
  /** Palette for the scratch cover. Defaults to the midnight-letter brass. */
  cover?: ScratchCover
  eyebrow?: string
  subHint?: string
}

const DEFAULT_LABEL = 'Tarjeta para raspar y revelar la sorpresa'
const DEFAULT_HINT = 'Raspá acá'
const DEFAULT_BUTTON = 'Revelar sin raspar'
const DEFAULT_EYEBROW = 'Sorpresa bloqueada'
const DEFAULT_SUB_HINT = 'Deslizá el dedo sobre la tarjeta'

const DEFAULT_COVER: Required<ScratchCover> = {
  from: '#1F1B16',
  mid: '#12100E',
  to: '#0B0B0C',
  sheen: 'rgba(200, 162, 75, 0.14)',
  frame: 'rgba(200, 162, 75, 0.35)',
}

export default function ScratchGate({
  onReveal,
  label = DEFAULT_LABEL,
  hint = DEFAULT_HINT,
  revealButtonLabel = DEFAULT_BUTTON,
  backdrop,
  threshold = 0.55,
  cover,
  eyebrow = DEFAULT_EYEBROW,
  subHint = DEFAULT_SUB_HINT,
}: ScratchGateProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const samplerRef = useRef<HTMLCanvasElement | null>(null)

  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const revealedRef = useRef(false)
  const lastCheckRef = useRef(0)

  const [revealed, setRevealed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const finishReveal = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    setRevealed(true)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onReveal?.()
      return
    }
    window.setTimeout(() => onReveal?.(), 700)
  }, [onReveal])

  const paintCover = useCallback(
    (width: number, height: number) => {
      const ctx = ctxRef.current
      if (!ctx) return
      const palette = cover ?? DEFAULT_COVER
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'

      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, palette.from)
      gradient.addColorStop(0.5, palette.mid)
      gradient.addColorStop(1, palette.to)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Foil diagonal sheen.
      const sheenColor = palette.sheen ?? DEFAULT_COVER.sheen
      const sheen = ctx.createLinearGradient(0, 0, width, height)
      sheen.addColorStop(0, 'transparent')
      sheen.addColorStop(0.48, sheenColor)
      sheen.addColorStop(0.52, sheenColor)
      sheen.addColorStop(1, 'transparent')
      ctx.fillStyle = sheen
      ctx.fillRect(0, 0, width, height)

      // Hairline frame.
      ctx.strokeStyle = palette.frame ?? DEFAULT_COVER.frame
      ctx.lineWidth = 1
      ctx.strokeRect(12, 12, width - 24, height - 24)

      ctx.restore()
    },
    [cover],
  )

  const sampleRevealedFraction = useCallback((): number => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return 0
    const size = 64
    if (!samplerRef.current) {
      samplerRef.current = document.createElement('canvas')
    }
    const sampler = samplerRef.current
    sampler.width = size
    sampler.height = size
    const sctx = sampler.getContext('2d', { willReadFrequently: true })
    if (!sctx) return 0
    sctx.clearRect(0, 0, size, size)
    sctx.drawImage(canvas, 0, 0, size, size)
    const data = sctx.getImageData(0, 0, size, size).data
    let clear = 0
    const total = size * size
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) clear += 1
    }
    return clear / total
  }, [])

  const maybeAutoReveal = useCallback(
    (force = false) => {
      const now = performance.now()
      if (!force && now - lastCheckRef.current < 250) return
      lastCheckRef.current = now
      if (sampleRevealedFraction() >= threshold) finishReveal()
    },
    [finishReveal, sampleRevealedFraction, threshold],
  )

  const setPointFromEvent = useCallback(
    (event: { clientX: number; clientY: number }) => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    },
    [],
  )

  const strokeTo = useCallback(
    (x: number, y: number) => {
      const ctx = ctxRef.current
      const canvas = canvasRef.current
      if (!ctx || !canvas) return
      const rect = canvas.getBoundingClientRect()
      const radius = Math.max(22, Math.min(rect.width, rect.height) * 0.075)
      const previous = lastPointRef.current ?? { x, y }

      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = radius * 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(previous.x, previous.y)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      lastPointRef.current = { x, y }
    },
    [],
  )

  // Canvas setup + native (non-passive) listeners — PLAN §9.2.
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctxRef.current = ctx
      if (!revealedRef.current) paintCover(rect.width, rect.height)
    }

    resize()

    const onPointerDown = (event: PointerEvent) => {
      if (revealedRef.current) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      drawingRef.current = true
      lastPointRef.current = null
      try {
        canvas.setPointerCapture(event.pointerId)
      } catch {
        // pointer capture may fail on some browsers; scratch still works.
      }
      const point = setPointFromEvent(event)
      if (point) strokeTo(point.x, point.y)
      event.preventDefault()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!drawingRef.current || revealedRef.current) return
      const point = setPointFromEvent(event)
      if (!point) return
      strokeTo(point.x, point.y)
      maybeAutoReveal()
      event.preventDefault()
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!drawingRef.current) return
      drawingRef.current = false
      lastPointRef.current = null
      try {
        canvas.releasePointerCapture(event.pointerId)
      } catch {
        // ignore
      }
      maybeAutoReveal(true)
    }

    // Prevent page scroll while scratching on touch devices.
    const onTouchMove = (event: TouchEvent) => {
      if (drawingRef.current) event.preventDefault()
    }

    // Some engines deliver touch via touch events rather than pointer events
    // when pointer events are partially supported; keep both paths safe.
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        const rect = container.getBoundingClientRect()
        if (!revealedRef.current) paintCover(rect.width, rect.height)
      })
    }

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('touchmove', onTouchMove)
      observer.disconnect()
    }
  }, [maybeAutoReveal, paintCover, setPointFromEvent, strokeTo])

  // Honor prefers-reduced-motion: reveal immediately, no scratch required.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    if (query.matches) finishReveal()
  }, [finishReveal])

  const onFallbackKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') finishReveal()
    },
    [finishReveal],
  )

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[var(--color-bg)]"
      style={{ minHeight: '100dvh' }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {backdrop}
      </div>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className={`gate-fade absolute inset-0 block h-full w-full ${
          revealed ? 'is-hidden' : ''
        }`}
        style={{ touchAction: 'none' }}
      />

      <div
        className={`gate-fade pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center ${
          revealed ? 'is-hidden' : ''
        }`}
      >
        <span className="eyebrow mb-4">{eyebrow}</span>
        <span className="font-display text-[clamp(2rem,9vw,4rem)] leading-none text-[var(--color-paper)]">
          {hint}
        </span>
        <span className="mt-4 max-w-xs font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          {subHint}
        </span>
      </div>

      <div
        className={`gate-fade absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] ${
          revealed ? 'is-hidden' : ''
        }`}
      >
        <button
          type="button"
          onClick={finishReveal}
          onKeyDown={onFallbackKeyDown}
          className="btn btn-outline"
        >
          {revealButtonLabel}
        </button>
        <p className="sr-only">
          Si no podés raspar, usá el botón para revelar la sorpresa.
        </p>
      </div>

      {reducedMotion && (
        <span className="sr-only">
          Las animaciones están desactivadas según tu preferencia del sistema.
        </span>
      )}
    </div>
  )
}
