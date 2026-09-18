import ShareCard from '@/components/ShareCard'
import Reveal from './Reveal'

type PaperClosingProps = {
  names: string
  slug: string
  brand: string
  checkoutUrl: string
  onCtaClick?: () => void
}

/**
 * Beat 5. Content-sized but generous. Sharing stays optional and comes after
 * the value (Meta Dev Policy §2.7): nothing here is gated.
 */
export default function PaperClosing({
  names,
  slug,
  brand,
  checkoutUrl,
  onCtaClick,
}: PaperClosingProps) {
  return (
    <section
      aria-labelledby="cierre-titulo"
      className="story-beat px-[clamp(1.25rem,5vw,3rem)] py-16 md:py-28"
    >
      <div className="container-page max-w-2xl text-center">
        <Reveal>
          <span
            aria-hidden="true"
            className="mx-auto mb-7 block h-px w-16 bg-[var(--color-accent)] opacity-70"
          />
          <p className="eyebrow mb-4">Con todo mi corazón</p>
          <h2
            id="cierre-titulo"
            className="font-display text-[clamp(2.1rem,8vw,3.75rem)] leading-[1.1] tracking-[-0.015em] text-[var(--color-paper)]"
          >
            Gracias por elegirme, {names}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
            Esto es solo un pedacito de todo lo que siento. Guardalo, volvé
            cuando quieras y compartilo si te nace.
          </p>
        </Reveal>

        <Reveal delayMs={120}>
          <ShareCard
            slug={slug}
            className="mt-8"
            shareText="Mirá la sorpresa que me hicieron"
          />
        </Reveal>

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
            Creá la tuya en 60s →
          </a>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
            Hecho con {brand}
          </p>
        </div>
      </div>
    </section>
  )
}
