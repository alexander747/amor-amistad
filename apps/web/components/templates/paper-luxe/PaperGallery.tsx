'use client'

import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { PagePhoto } from '@/lib/types'
import Reveal from './Reveal'

type PaperGalleryProps = {
  photos: PagePhoto[]
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function captionFor(photo: PagePhoto, index: number): string {
  const alt = photo.alt?.trim()
  return alt && alt.length > 0 ? alt : `Momento ${pad(index + 1)}`
}

function GalleryPlate({
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
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <Reveal delayMs={index * 90} className="w-[78vw] shrink-0 snap-center md:w-full">
      <figure ref={frameRef} className="pl-plate group">
        <div className="pl-plate-mat">
          <div className="relative aspect-[4/5] overflow-hidden">
            <motion.div
              data-parallax
              style={{ y: reduce ? 0 : y }}
              className="absolute inset-x-0 -bottom-[5%] -top-[5%]"
            >
              <Image
                src={photo.url}
                alt={photo.alt || `Recuerdo ${index + 1} de la pareja`}
                fill
                sizes="(max-width: 768px) 78vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </motion.div>
          </div>
        </div>

        <figcaption className="pl-plate-caption flex items-baseline justify-center gap-3 text-center">
          <span
            aria-hidden="true"
            className="font-mono text-[10px] tracking-[0.3em] text-[var(--pl-copper-ink)]"
          >
            {pad(index + 1)}
          </span>
          <span aria-hidden="true" className="h-px w-5 bg-[var(--color-border)]" />
          <span className="line-clamp-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            {captionFor(photo, index)}
          </span>
          <span className="sr-only">
            {`Foto ${index + 1} de ${total}`}
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
}

export default function PaperGallery({ photos }: PaperGalleryProps) {
  if (photos.length === 0) return null

  return (
    <section
      aria-labelledby="galeria-titulo"
      className="story-beat px-[clamp(1.25rem,5vw,3rem)] py-14 md:py-24"
    >
      <div className="container-page">
        <Reveal>
          <header className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4">Los recuerdos</p>
            <h2
              id="galeria-titulo"
              className="font-display text-[clamp(1.9rem,6vw,3.1rem)] leading-[1.1] tracking-[-0.015em] text-[var(--color-paper)]"
            >
              Momentos que guardamos
            </h2>
            <span
              aria-hidden="true"
              className="mx-auto mt-6 block h-px w-16 bg-[var(--color-accent)] opacity-60"
            />
          </header>
        </Reveal>

        {/* Mobile: a calm horizontal set of mounted plates with its own scroll.
            Desktop: an editorial grid. The track clips its own overflow, so the
            page never gains a horizontal scrollbar. */}
        <div className="-mx-[clamp(1.25rem,5vw,3rem)] mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[clamp(1.25rem,5vw,3rem)] py-4 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-10 md:overflow-visible md:px-0 md:py-0 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <GalleryPlate
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
