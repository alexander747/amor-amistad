'use client'

import Image from 'next/image'
import { motion, useScroll, useSpring } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ScratchGate, { type ScratchCover } from '@/components/ScratchGate'
import { useCountUp } from '@/components/templates/midnight-letter/useCountUp'
import YouTubeEmbed from '@/components/templates/midnight-letter/YouTubeEmbed'
import { trackEvent } from '@/lib/analytics-client'
import { daysTogether, formatLongDate } from '@/lib/dates'
import { getBrandName, getCheckoutUrl } from '@/lib/env'
import type { PageData } from '@/lib/types'
import { outfit, sora } from './fonts'
import NeonClosing from './NeonClosing'
import NeonGallery from './NeonGallery'
import NeonHero from './NeonHero'
import NeonMessages from './NeonMessages'
import Reveal from './Reveal'

type NeonCorazonProps = {
  data: PageData
}

const NEON_COVER: ScratchCover = {
  from: '#FF0099',
  mid: '#493240',
  to: '#7F00FF',
  sheen: 'rgba(225, 0, 255, 0.28)',
  frame: 'rgba(0, 229, 255, 0.5)',
}

const CONFETTI_COLORS = ['#FF0099', '#E100FF', '#7F00FF', '#00E5FF', '#FFD1F0']

function coupleLabel(names: PageData['page']['couple_names']): string {
  const parts = [names?.a, names?.b].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )
  if (parts.length === 0) return 'Ustedes dos'
  return parts.join(' & ')
}

/**
 * Confetti burst on reveal. Loaded on demand so the library never ships with
 * the landing or the other template, and skipped under reduced motion.
 */
function fireConfetti(): void {
  void (async () => {
    const { default: confetti } = await import('canvas-confetti')
    const base = {
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
      zIndex: 70,
    }
    confetti({
      ...base,
      particleCount: 80,
      spread: 78,
      startVelocity: 44,
      scalar: 1.05,
      origin: { x: 0.5, y: 0.6 },
    })
    window.setTimeout(() => {
      confetti({
        ...base,
        particleCount: 45,
        angle: 60,
        spread: 62,
        origin: { x: 0, y: 0.72 },
      })
      confetti({
        ...base,
        particleCount: 45,
        angle: 120,
        spread: 62,
        origin: { x: 1, y: 0.72 },
      })
    }, 170)
  })()
}

/** Thin gradient line tracking how far into the story we are. Decorative. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 24,
    mass: 0.35,
  })

  return (
    <motion.div
      aria-hidden="true"
      data-scroll-progress
      style={{ scaleX }}
      className="neon-gradient-bar fixed inset-x-0 top-0 z-40 h-[3px] origin-left"
    />
  )
}

export default function NeonCorazon({ data }: NeonCorazonProps) {
  const { page, messages, photos } = data
  const [revealed, setRevealed] = useState(false)
  const [animateCounter, setAnimateCounter] = useState(false)
  const slug = page.slug
  const names = coupleLabel(page.couple_names)
  const brand = getBrandName()
  const checkoutUrl = getCheckoutUrl()
  const days = useMemo(
    () => daysTogether(page.anniversary_date),
    [page.anniversary_date],
  )
  const dateLabel = formatLongDate(page.anniversary_date)
  const countDays = useCountUp(days ?? 0, animateCounter && days !== null)

  useEffect(() => {
    trackEvent(slug, 'view')
  }, [slug])

  const handleReveal = useCallback(() => {
    setRevealed(true)
    trackEvent(slug, 'reveal')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setAnimateCounter(!reduce)
    if (!reduce) fireConfetti()
  }, [slug])

  const handleCtaClick = useCallback(() => {
    trackEvent(slug, 'cta_click')
  }, [slug])

  return (
    <div
      className={`neon-corazon relative min-h-[100dvh] ${sora.variable} ${outfit.variable}`}
    >
      {!revealed && (
        <ScratchGate
          onReveal={handleReveal}
          cover={NEON_COVER}
          eyebrow="Tu sorpresa te espera"
          hint="Raspá acá"
          subHint="Deslizá el dedo por la portada"
          revealButtonLabel="Revelar sin raspar"
          backdrop={
            <div className="relative h-full w-full">
              {photos[0] ? (
                <Image
                  src={photos[0].url}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover opacity-40 blur-2xl"
                />
              ) : (
                <div className="neon-aurora h-full w-full" />
              )}
            </div>
          }
        />
      )}

      <ScrollProgress />

      <main
        className="neon-aurora relative overflow-hidden"
        aria-hidden={!revealed}
      >
        {/* Beat 1 — Hero (full viewport) */}
        <NeonHero
          names={names}
          dateLabel={dateLabel}
          days={days}
          countDays={countDays}
        />

        {/* Beat 2 — Gallery */}
        <NeonGallery photos={photos} />

        {/* Beat 3 — Messages */}
        <NeonMessages messages={messages} />

        {/* Beat 4 — Video */}
        {page.youtube_url && (
          <section
            aria-labelledby="video-titulo"
            className="story-beat relative px-[clamp(1.25rem,5vw,3rem)] py-14 md:py-24"
          >
            <div className="container-page">
              <div className="mx-auto max-w-2xl">
                <Reveal>
                  <p className="eyebrow mb-3">Nuestra canción</p>
                  <h2
                    id="video-titulo"
                    className="font-display text-[clamp(1.8rem,7vw,3.25rem)] tracking-[-0.03em] text-[var(--color-paper)]"
                  >
                    Dale play
                  </h2>
                </Reveal>
                <Reveal delay={0.08} className="mt-6">
                  <YouTubeEmbed url={page.youtube_url} title={`Video para ${names}`} />
                </Reveal>
              </div>
            </div>
          </section>
        )}

        {/* Beat 5 — Closing */}
        <NeonClosing
          names={names}
          slug={slug}
          brand={brand}
          checkoutUrl={checkoutUrl}
          onCtaClick={handleCtaClick}
        />
      </main>
    </div>
  )
}
