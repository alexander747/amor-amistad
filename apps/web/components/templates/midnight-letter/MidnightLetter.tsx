'use client'

import Image from 'next/image'
import { motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import ScratchGate from '@/components/ScratchGate'
import { trackEvent } from '@/lib/analytics-client'
import { daysTogether, formatLongDate } from '@/lib/dates'
import { getBrandName, getCheckoutUrl } from '@/lib/env'
import type { PageData } from '@/lib/types'
import Closing from './Closing'
import Gallery from './Gallery'
import LetterHero from './LetterHero'
import Messages from './Messages'
import RevealOnScroll from './RevealOnScroll'
import { useCountUp } from './useCountUp'
import YouTubeEmbed from './YouTubeEmbed'

type MidnightLetterProps = {
  data: PageData
}

function coupleLabel(names: PageData['page']['couple_names']): string {
  const parts = [names?.a, names?.b].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )
  if (parts.length === 0) return 'Ustedes dos'
  return parts.join(' & ')
}

/** Thin brass line that tracks how far into the story we are. Decorative. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  })

  return (
    <motion.div
      aria-hidden="true"
      data-scroll-progress
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-30 h-[2px] origin-left bg-[var(--color-accent)] opacity-70"
    />
  )
}

export default function MidnightLetter({ data }: MidnightLetterProps) {
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

      <ScrollProgress />

      <main
        className="grain relative min-h-[100dvh] overflow-hidden bg-[var(--color-bg)]"
        aria-hidden={!revealed}
      >
        {/* Beat 1 — Hero (full viewport; shared with the landing preview) */}
        <LetterHero
          names={names}
          dateLabel={dateLabel}
          days={days}
          countDays={countDays}
        />

        {/* Beat 2 — Gallery (photos are the protagonist) */}
        <Gallery photos={photos} />

        {/* Beat 3 — Messages */}
        <Messages messages={messages} />

        {/* Beat 4 — Video (proportional to the player, not full screen) */}
        {page.youtube_url && (
          <section aria-labelledby="video-titulo" className="story-beat py-12 md:py-24">
            <div className="container-page">
              <div className="mx-auto max-w-2xl">
                <RevealOnScroll>
                  <p className="eyebrow mb-3">Nuestra canción</p>
                  <h2
                    id="video-titulo"
                    className="font-display text-[clamp(1.75rem,6vw,3rem)] tracking-[-0.02em] text-[var(--color-paper)]"
                  >
                    Dale play
                  </h2>
                </RevealOnScroll>
                <RevealOnScroll delayMs={120} className="mt-6">
                  <YouTubeEmbed url={page.youtube_url} title={`Video para ${names}`} />
                </RevealOnScroll>
              </div>
            </div>
          </section>
        )}

        {/* Beat 5 — Closing */}
        <Closing
          names={names}
          slug={slug}
          brand={brand}
          checkoutUrl={checkoutUrl}
          onCtaClick={handleCtaClick}
        />
      </main>
    </>
  )
}
