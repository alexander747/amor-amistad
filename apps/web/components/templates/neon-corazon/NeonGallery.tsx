'use client'

import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { PagePhoto } from '@/lib/types'
import Reveal from './Reveal'

type NeonGalleryProps = {
  photos: PagePhoto[]
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function captionFor(photo: PagePhoto, index: number): string {
  const alt = photo.alt?.trim()
  return alt && alt.length > 0 ? alt : `Momento ${pad(index + 1)}`
}

function GalleryCard({
  photo,
  index,
  total,
}: {
  photo: PagePhoto
  index: number
  total: number
}) {
  const frameRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  const tilt = index % 2 === 0 ? '-rotate-2' : 'rotate-2'

  return (
    <Reveal
      delay={index * 0.06}
      from={0.9}
      className={`shrink-0 snap-center ${index > 0 ? '-ml-[7vw] md:ml-0' : ''}`}
    >
      <figure
        ref={frameRef}
        className={`neon-card group relative w-[86vw] overflow-hidden rounded-[var(--radius-lg)] md:w-full ${tilt} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-0`}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            data-parallax
            style={{ y: reduce ? 0 : y }}
            className="absolute inset-x-0 -bottom-[7%] -top-[7%]"
          >
            <Image
              src={photo.url}
              alt={photo.alt || `Recuerdo ${index + 1} de la pareja`}
              fill
              sizes="(max-width: 768px) 86vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120B1A]/85 via-[#120B1A]/10 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 [background:linear-gradient(125deg,rgba(255,0,153,0.28),transparent_42%,transparent_58%,rgba(0,229,255,0.28))]"
          />
        </div>

        <span
          aria-hidden="true"
          className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-white backdrop-blur-sm"
        >
          {pad(index + 1)} / {pad(total)}
        </span>

        <figcaption className="absolute inset-x-0 bottom-0 p-4">
          <span className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-white">
            {captionFor(photo, index)}
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
}

export default function NeonGallery({ photos }: NeonGalleryProps) {
  if (photos.length === 0) return null

  return (
    <section
      aria-labelledby="galeria-titulo"
      className="story-beat relative overflow-hidden px-[clamp(1.25rem,5vw,3rem)] py-14 md:py-24"
    >
      <div className="container-page">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Los recuerdos</p>
              <h2
                id="galeria-titulo"
                className="font-display text-[clamp(1.8rem,7vw,3.25rem)] tracking-[-0.03em] text-[var(--color-paper)]"
              >
                Momentos que guardamos
              </h2>
            </div>
            <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:block">
              {pad(photos.length)} {photos.length === 1 ? 'momento' : 'momentos'}
            </span>
          </div>
        </Reveal>

        {/* Mobile: overlapping stack with its own scroll. The track clips its own
            overflow, so the page never gains a horizontal scrollbar. */}
        <div className="-mx-[clamp(1.25rem,5vw,3rem)] mt-9 flex snap-x snap-mandatory gap-0 overflow-x-auto px-[clamp(1.25rem,5vw,3rem)] py-6 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:py-0 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              index={index}
              total={photos.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
