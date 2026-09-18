'use client'

import Image from 'next/image'
import { motion, useScroll, useSpring } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ScratchGate, { type ScratchCover } from '@/components/ScratchGate'
import YouTubeEmbed from '@/components/templates/midnight-letter/YouTubeEmbed'
import { trackEvent } from '@/lib/analytics-client'
import { daysTogether, formatLongDate } from '@/lib/dates'
import { getBrandName, getCheckoutUrl } from '@/lib/env'
import type { PageData } from '@/lib/types'
import { cormorant, jost } from './fonts'
import PaperClosing from './PaperClosing'
import PaperGallery from './PaperGallery'
import PaperHero from './PaperHero'
import PaperMessages from './PaperMessages'
import Reveal from './Reveal'

type PaperLuxeProps = {
  data: PageData
}

/**
 * Light, letterpress cover. Cream paper with a copper hairline instead of the
 * dark brass default, so the gate already reads as fine stationery.
 */
const PAPER_COVER: ScratchCover = {
  from: '#F2EFE9',
  mid: '#FAF7F0',
  to: '#E6DCCB',
  sheen: 'rgba(166, 120, 90, 0.10)',
  frame: 'rgba(166, 120, 90, 0.45)',
}

function coupleLabel(names: PageData['page']['couple_names']): string {
  const parts = [names?.a, names?.b].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )
  if (parts.length === 0) return 'Ustedes dos'
  return parts.join(' & ')
}

/** Thin copper line that tracks how far into the story we are. Decorative. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.7,
  })

  return (
    <motion.div
      aria-hidden="true"
      data-scroll-progress
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-30 h-px origin-left bg-[var(--color-accent)] opacity-60"
    />
  )
}

export default function PaperLuxe({ data }: PaperLuxeProps) {
  const { page, messages, photos } = data
  const [revealed, setRevealed] = useState(false)
  const slug = page.slug
  const names = coupleLabel(page.couple_names)
  const brand = getBrandName()
  const checkoutUrl = getCheckoutUrl()
  const days = useMemo(
    () => daysTogether(page.anniversary_date),
    [page.anniversary_date],
  )
  const dateLabel = formatLongDate(page.anniversary_date)

  useEffect(() => {
    trackEvent(slug, 'view')
  }, [slug])

  const handleReveal = useCallback(() => {
    setRevealed(true)
    trackEvent(slug, 'reveal')
  }, [slug])

  const handleCtaClick = useCallback(() => {
    trackEvent(slug, 'cta_click')
  }, [slug])

  return (
    <div
      className={`paper-luxe relative min-h-[100dvh] ${cormorant.variable} ${jost.variable}`}
    >
      {!revealed && (
        <ScratchGate
          onReveal={handleReveal}
          cover={PAPER_COVER}
          eyebrow="Una sorpresa para vos"
          hint="Raspá acá"
          subHint="Deslizá el dedo sobre el papel"
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
                  className="object-cover opacity-20 blur-2xl"
                />
              ) : (
                <div className="pl-gate-backdrop h-full w-full" />
              )}
            </div>
          }
        />
      )}

      <ScrollProgress />

      <main className="pl-paper relative overflow-hidden" aria-hidden={!revealed}>
        {/* Beat 1 — Hero (full viewport; names + days as an editorial figure) */}
        <PaperHero names={names} dateLabel={dateLabel} days={days} />

        {/* Beat 2 — Gallery (photos mounted like printed plates) */}
        <PaperGallery photos={photos} />

        {/* Beat 3 — Messages (large serif quotes, airy) */}
        <PaperMessages messages={messages} />

        {/* Beat 4 — Video (proportional to the player, not full screen) */}
        {page.youtube_url && (
          <section
            aria-labelledby="video-titulo"
            className="story-beat px-[clamp(1.25rem,5vw,3rem)] py-12 md:py-24"
          >
            <div className="container-page">
              <div className="mx-auto max-w-2xl text-center">
                <Reveal>
                  <p className="eyebrow mb-4">Nuestra canción</p>
                  <h2
                    id="video-titulo"
                    className="font-display text-[clamp(1.9rem,6vw,3.1rem)] leading-[1.1] tracking-[-0.015em] text-[var(--color-paper)]"
                  >
                    Dale play
                  </h2>
                </Reveal>
                <Reveal delayMs={120} className="mt-8">
                  <div className="pl-plate p-2 sm:p-3">
                    <YouTubeEmbed
                      url={page.youtube_url}
                      title={`Video para ${names}`}
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        )}

        {/* Beat 5 — Closing (share card + Latido CTA + badge) */}
        <PaperClosing
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
