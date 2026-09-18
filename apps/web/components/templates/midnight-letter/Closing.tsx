import ShareCard from '@/components/ShareCard'
import RevealOnScroll from './RevealOnScroll'

type ClosingProps = {
  names: string
  slug: string
  brand: string
  checkoutUrl: string
  onCtaClick?: () => void
}

/**
 * Beat 5. Content-sized but generous: the story ends with the share card, the
 * Latido CTA and the "hecho con" badge. Nothing here is gated behind sharing
 * (Meta Dev Policy §2.7) — sharing is optional and comes after the value.
 */
export default function Closing({
  names,
  slug,
  brand,
  checkoutUrl,
  onCtaClick,
}: ClosingProps) {
  return (
    <section aria-labelledby="cierre-titulo" className="story-beat py-14 md:py-28">
      <div className="container-page max-w-2xl text-center">
        <RevealOnScroll>
          <span
            aria-hidden="true"
            className="mx-auto mb-8 block h-px w-16 bg-[var(--color-accent)] opacity-70"
          />
          <p className="eyebrow mb-4">Con todo mi corazón</p>
          <h2
            id="cierre-titulo"
            className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-[var(--color-paper)]"
          >
            Gracias por elegirme, {names}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
            Esto es solo un pedacito de todo lo que siento. Guardalo, volvé
            cuando quieras y compartilo si te nace.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <ShareCard
            slug={slug}
            className="mt-8"
            shareText="Mirá la sorpresa que me hicieron"
          />
        </RevealOnScroll>

        <div className="mx-auto mt-12 max-w-md border-t border-[var(--color-border)] pt-8">
          <p className="font-display text-xl text-[var(--color-paper)]">
            Te quedó linda, ¿no?
          </p>
          <a
            href={checkoutUrl}
            onClick={onCtaClick}
            className="btn btn-brass mt-4 w-full sm:w-auto"
            rel="noopener"
          >
            Creá la tuya →
          </a>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            Hecho con {brand}
          </p>
        </div>
      </div>
    </section>
  )
}
