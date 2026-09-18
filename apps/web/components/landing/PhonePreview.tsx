'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import LetterHero from '@/components/templates/midnight-letter/LetterHero'
import { useCountUp } from '@/components/templates/midnight-letter/useCountUp'

const SCREEN_W = 390
const SCREEN_H = 844
const FRAME_PADDING = 6

const DEMO_NAMES = 'Mariana & Julián'
const DEMO_DATE = '14 de marzo de 2021'
const DEMO_DAYS = 2013

/**
 * Live product preview: the REAL `LetterHero` from the midnight-letter
 * template, rendered inside a phone frame and driven by an auto-play loop
 * (brass cover fades → hero appears → days counter counts up → repeat).
 *
 * The template hero uses `cqw` units, so it scales against the 390 px device
 * screen instead of the browser viewport — no fake mockup, no iframe.
 */
export default function PhonePreview() {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [frameW, setFrameW] = useState(300)
  const [cycle, setCycle] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [animateCounter, setAnimateCounter] = useState(false)
  const countDays = useCountUp(DEMO_DAYS, animateCounter)

  // Fit the device to its column. Measured, so the frame is never clipped.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const width = el.clientWidth
      if (width > 0) setFrameW(Math.min(width, SCREEN_W))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Choreographed loop. Reduced motion shows the finished state, no loop.
  useEffect(() => {
    if (reduce) {
      setRevealed(true)
      setAnimateCounter(false)
      return
    }
    setRevealed(false)
    setAnimateCounter(false)
    const revealTimer = window.setTimeout(() => {
      setRevealed(true)
      setAnimateCounter(true)
    }, 1500)
    const loopTimer = window.setTimeout(() => setCycle((value) => value + 1), 8400)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(loopTimer)
    }
  }, [cycle, reduce])

  const frameH = (frameW * SCREEN_H) / SCREEN_W
  const contentScale = Math.max(0, (frameW - FRAME_PADDING * 2) / SCREEN_W)

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[320px] sm:max-w-[352px]"
    >
      <div
        aria-hidden="true"
        className="relative mx-auto"
        style={{ width: frameW, height: frameH }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(circle_at_60%_25%,rgba(200,162,75,0.26),transparent_62%)] blur-3xl"
        />

        <div className="absolute inset-0 rounded-[2.6rem] border border-[var(--color-border)] bg-[#070708] p-[6px] shadow-[0_50px_140px_-40px_rgba(0,0,0,0.95)]">
          <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-[var(--color-bg)]">
            <div
              className="preview-screen absolute left-0 top-0"
              style={{
                width: SCREEN_W,
                height: SCREEN_H,
                transform: `scale(${contentScale})`,
                transformOrigin: 'top left',
              }}
            >
              <LetterHero
                names={DEMO_NAMES}
                dateLabel={DEMO_DATE}
                days={DEMO_DAYS}
                countDays={countDays}
                className="h-full min-h-0"
                showScrollHint={false}
              />

              <motion.div
                initial={false}
                animate={
                  revealed
                    ? { opacity: 0, filter: 'blur(10px)', scale: 1.04 }
                    : { opacity: 1, filter: 'blur(0px)', scale: 1 }
                }
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden px-8 text-center"
                style={{
                  background:
                    'linear-gradient(135deg,#1F1B16 0%,#12100E 55%,#0B0B0C 100%)',
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_18%_0%,rgba(200,162,75,0.24),transparent_58%)]" />
                <div className="pointer-events-none absolute inset-3 rounded-[1.7rem] border border-[rgba(200,162,75,0.35)]" />
                <div className="btn-shimmer pointer-events-none absolute inset-0 opacity-30" />
                <span className="eyebrow mb-3">Sorpresa bloqueada</span>
                <span className="font-display text-[2.6rem] leading-none text-[var(--color-paper)]">
                  Raspá acá
                </span>
                <span className="mt-3 max-w-[13rem] font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                  Deslizá el dedo sobre la tarjeta
                </span>
              </motion.div>
            </div>

            {/* Dynamic island + home indicator stay crisp (unscaled). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[10px] z-20 h-[16px] w-[68px] -translate-x-1/2 rounded-full bg-black/85"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[6px] left-1/2 z-20 h-[3px] w-[74px] -translate-x-1/2 rounded-full bg-white/25"
            />
          </div>
        </div>
      </div>

      <span className="sr-only">
        Vista previa de una página sorpresa hecha con Latido: una portada dorada
        que se raspa para revelar los nombres de la pareja y los días que llevan
        juntos.
      </span>
    </div>
  )
}
