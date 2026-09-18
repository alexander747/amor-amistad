import Image from 'next/image'
import type { PagePhoto } from '@/lib/types'
import RevealOnScroll from './RevealOnScroll'

type GalleryProps = {
  photos: PagePhoto[]
}

export default function Gallery({ photos }: GalleryProps) {
  if (photos.length === 0) return null

  return (
    <section
      aria-labelledby="galeria-titulo"
      className="story-beat py-20 md:py-28"
    >
      <div className="container-page">
        <RevealOnScroll>
          <p className="eyebrow mb-3">Los recuerdos</p>
          <h2
            id="galeria-titulo"
            className="font-display text-[clamp(1.75rem,6vw,3rem)] text-[var(--color-paper)]"
          >
            Momentos que guardamos
          </h2>
        </RevealOnScroll>
      </div>

      {/* Mobile: carrusel con scroll-snap. Desktop: grilla editorial. */}
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,5vw,3rem)] pb-4 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
        {photos.map((photo, index) => (
          <RevealOnScroll
            key={photo.id}
            className={
              index % 5 === 0
                ? 'md:col-span-2 md:row-span-2'
                : undefined
            }
          >
            <figure className="relative w-[78vw] shrink-0 snap-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] md:w-full">
              <div className="relative aspect-[4/5]">
                <Image
                  src={photo.url}
                  alt={photo.alt || `Recuerdo ${index + 1} de la pareja`}
                  fill
                  sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
              />
            </figure>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
