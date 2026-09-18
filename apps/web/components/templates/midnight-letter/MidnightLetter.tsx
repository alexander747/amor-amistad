'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import ScratchGate from '@/components/ScratchGate'
import ShareCard from '@/components/ShareCard'
import { trackEvent } from '@/lib/analytics-client'
import { daysTogether, formatLongDate, formatNumber } from '@/lib/dates'
import { getBrandName, getCheckoutUrl } from '@/lib/env'
import type { PageData } from '@/lib/types'
import Gallery from './Gallery'
import Messages from './Messages'
import RevealOnScroll from './RevealOnScroll'
import YouTubeEmbed from './YouTubeEmbed'

type MidnightLetterProps = {
  data: PageData
}

function useCountUp(target: number, enabled: boolean): number {
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

function coupleLabel(names: PageData['page']['couple_names']): string {
  const parts = [names?.a, names?.b].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )
  if (parts.length === 0) return 'Ustedes dos'
  return parts.join(' & ')
}

export default function MidnightLetter({ data }: MidnightLetterProps) {
  const { page, messages, photos } = data
  const [revealed, setRevealed] = useState(false)
  const [animateCounter, setAnimateCounter] = useState(false)
  const slug = page.slug
  const names = coupleLabel(page.couple_names)
  const days = useMemo(
    () => daysTogether(page.anniversary_date),
    [page.anniversary_date],
  )
  const dateLabel = formatLongDate(page.anniversary_date)
  const countDays = useCountUp(days ?? 0, animateCounter && days !== null)

  useEffect(() => {
    trackEvent(slug, 'view')
  }, [slug])

  const handleReveal = () => {
    setRevealed(true)
    trackEvent(slug, 'reveal')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setAnimateCounter(!reduce)
  }

  const handleCtaClick = () => {
    trackEvent(slug, 'cta_click')
  }

  return (
    <>
      {!revealed && (
        <ScratchGate
          onReveal={handleReveal}
          backdrop={
            <div className="relative h-full w-full">
              {photos[0] ? (
                <Image
                  src={photos[0].url}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover opacity-40 blur-xl"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]" />
              )}
            </div>
          }
        />
      )}

      <main
        className="snap-track grain relative min-h-[100dvh] overflow-hidden bg-[var(--color-bg)]"
        aria-hidden={!revealed}
      >
        {/* Beat 1 — Hero */}
        <section className="story-beat px-[clamp(1.25rem,5vw,3rem)]">
          <div className="mx-auto w-full max-w-3xl">
            <p className="eyebrow mb-6">Para {names}</p>
            <h1 className="display-fluid font-display text-[var(--color-paper)]">
              {names}
            </h1>
            {dateLabel && (
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                Juntos desde el {dateLabel}
              </p>
            )}
            {days !== null && (
              <div className="mt-10 flex items-end gap-4 border-t border-[var(--color-border)] pt-8">
                <span
                  className="font-display text-[clamp(3rem,16vw,7rem)] leading-none text-[var(--color-accent)]"
                  aria-hidden="true"
                >
                  {formatNumber(countDays)}
                </span>
                <span className="pb-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                  días
                  <br />
                  juntos
                </span>
                <span className="sr-only">
                  {formatNumber(days)} días juntos
                </span>
              </div>
            )}
          </div>
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]"
          >
            Desliza ↓
          </div>
        </section>

        {/* Beat 2 — Gallery */}
        <Gallery photos={photos} />

        {/* Beat 3 — Messages */}
        <Messages messages={messages} />

        {/* Beat 4 — Video */}
        {page.youtube_url && (
          <section aria-labelledby="video-titulo" className="story-beat py-20">
            <div className="container-page max-w-4xl">
              <RevealOnScroll>
                <p className="eyebrow mb-3">Nuestra canción</p>
                <h2
                  id="video-titulo"
                  className="mb-8 font-display text-[clamp(1.75rem,6vw,3rem)] text-[var(--color-paper)]"
                >
                  Dale play
                </h2>
              </RevealOnScroll>
              <RevealOnScroll delayMs={120}>
                <YouTubeEmbed url={page.youtube_url} title={`Video para ${names}`} />
              </RevealOnScroll>
            </div>
          </section>
        )}

        {/* Beat 5 — Closing */}
        <section aria-labelledby="cierre-titulo" className="story-beat py-24">
          <div className="container-page max-w-2xl text-center">
            <RevealOnScroll>
              <p className="eyebrow mb-4">Con todo mi corazón</p>
              <h2
                id="cierre-titulo"
                className="font-display text-[clamp(2rem,7vw,3.5rem)] text-[var(--color-paper)]"
              >
                Gracias por elegirme, {names}
              </h2>
              <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
                Esto es solo un pedacito de todo lo que siento. Guardalo, volvé
                cuando quieras y compartilo si te nace.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120}>
              <ShareCard
                slug={slug}
                className="mt-10"
                shareText="Mirá la sorpresa que me hicieron"
              />
            </RevealOnScroll>

            <div className="mx-auto mt-20 max-w-md border-t border-[var(--color-border)] pt-10">
              <p className="font-display text-xl text-[var(--color-paper)]">
                Te quedó linda, ¿no?
              </p>
              <a
                href={getCheckoutUrl()}
                onClick={handleCtaClick}
                className="btn btn-brass mt-5 w-full sm:w-auto"
                rel="noopener"
              >
                Creá la tuya →
              </a>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                Hecho con {getBrandName()}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
