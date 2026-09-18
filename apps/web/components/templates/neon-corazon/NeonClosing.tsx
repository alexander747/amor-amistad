import ShareCard from '@/components/ShareCard'
import Reveal from './Reveal'

type NeonClosingProps = {
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
export default function NeonClosing({
  names,
  slug,
  brand,
  checkoutUrl,
  onCtaClick,
}: NeonClosingProps) {
  return (
    <section
      aria-labelledby="cierre-titulo"
      className="story-beat relative px-[clamp(1.25rem,5vw,3rem)] py-16 md:py-28"
    >
      <div className="container-page max-w-2xl text-center">
        <Reveal>
          <span
            aria-hidden="true"
            className="neon-gradient-bar mx-auto mb-7 block h-1 w-20 rounded-full"
          />
          <p className="eyebrow mb-4">Con todo mi corazón</p>
          <h2
            id="cierre-titulo"
            className="font-display text-[clamp(2rem,8vw,3.5rem)] leading-[1.02] tracking-[-0.03em] text-[var(--color-paper)]"
          >
            Gracias por elegirme,{' '}
            <span className="neon-text-gradient neon-animate-gradient">{names}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
            Esto es solo un pedacito de todo lo que siento. Guardalo, volvé
            cuando quieras y compartilo si te nace.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
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
            Creá la tuya →
          </a>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            Hecho con {brand}
          </p>
        </div>
      </div>
    </section>
  )
}
