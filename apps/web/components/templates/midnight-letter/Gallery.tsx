'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import type { PagePhoto } from '@/lib/types'
import RevealOnScroll from './RevealOnScroll'

type GalleryProps = {
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
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])
  const tilt = index % 2 === 0 ? -1.6 : 1.6

  return (
    <RevealOnScroll
      variant="tilt"
      className={`shrink-0 snap-center ${index > 0 ? '-ml-[7vw] md:ml-0' : ''}`}
      style={{ '--tilt': `${tilt}deg` } as CSSProperties}
    >
      <figure
        ref={frameRef}
        className="group relative w-[90vw] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_36px_90px_-46px_rgba(0,0,0,0.95)] md:w-full"
      >
        <div className="relative aspect-[5/6] overflow-hidden md:aspect-[4/5]">
          <motion.div
            data-parallax
            style={{ y }}
            className="absolute inset-x-0 -bottom-[9%] -top-[9%]"
          >
            <Image
              src={photo.url}
              alt={photo.alt || `Recuerdo ${index + 1} de la pareja`}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
          />
        </div>

        <span
          aria-hidden="true"
          className="absolute left-4 top-4 rounded-full border border-[var(--color-border)] bg-black/30 px-2.5 py-1 font-mono text-[10px] tracking-[0.22em] text-[var(--color-paper)] backdrop-blur-sm"
        >
          {pad(index + 1)} / {pad(total)}
        </span>

        <figcaption className="absolute inset-x-0 bottom-0 p-4">
          <span className="line-clamp-1 font-mono text-[10px] uppercase tracking-[0.26em] text-[var(--color-paper)]">
            {captionFor(photo, index)}
          </span>
        </figcaption>
      </figure>
    </RevealOnScroll>
  )
}

export default function Gallery({ photos }: GalleryProps) {
  if (photos.length === 0) return null

  return (
    <section aria-labelledby="galeria-titulo" className="story-beat py-12 md:py-24">
      <div className="container-page">
        <RevealOnScroll>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Los recuerdos</p>
              <h2
                id="galeria-titulo"
                className="font-display text-[clamp(1.75rem,6vw,3rem)] tracking-[-0.02em] text-[var(--color-paper)]"
              >
                Momentos que guardamos
              </h2>
            </div>
            <span className="hidden shrink-0 font-mono text-[11px] tracking-[0.24em] text-[var(--color-text-muted)] sm:block">
              {pad(photos.length)} {photos.length === 1 ? 'momento' : 'momentos'}
            </span>
          </div>
        </RevealOnScroll>

        {/* Mobile: overlapping film strip with its own scroll. Desktop: editorial
            grid. The strip is clipped by its own overflow, so the page never
            gains a horizontal scrollbar. */}
        <div className="-mx-[clamp(1.25rem,5vw,3rem)] mt-8 flex snap-x snap-mandatory gap-0 overflow-x-auto px-[clamp(1.25rem,5vw,3rem)] py-5 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 md:py-0 lg:grid-cols-3">
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
