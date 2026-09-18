import { formatNumber } from '@/lib/dates'

type PaperHeroProps = {
  names: string
  dateLabel: string | null
  /** Real number of days — the figure is static (no bouncy counter). */
  days: number | null
  className?: string
  showScrollHint?: boolean
}

/**
 * Beat 1 of the paper-luxe story. The only beat that claims the full viewport.
 * Names set in a high-contrast serif, then the days-together figure presented
 * as an editorial number rather than an animated counter.
 *
 * Sizes use container query units with a `vw` fallback so the same component
 * scales correctly inside the landing's phone-sized preview.
 */
export default function PaperHero({
  names,
  dateLabel,
  days,
  className = '',
  showScrollHint = true,
}: PaperHeroProps) {
  return (
    <section className={`story-beat story-beat-full hero-pad ${className}`}>
      <div
        aria-hidden="true"
        className="pl-hero-glow pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <p className="eyebrow mb-8">Una sorpresa para</p>

        <h1 className="pl-display font-display break-words text-[var(--color-paper)]">
          {names}
        </h1>

        {dateLabel && (
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
            Juntos desde el {dateLabel}
          </p>
        )}

        {days !== null && (
          <div className="mt-12 flex flex-col items-center md:mt-16">
            <span
              aria-hidden="true"
              className="mb-7 block h-px w-16 bg-[var(--color-accent)] opacity-70"
            />
            <span
              aria-hidden="true"
              className="pl-days font-display text-[var(--color-accent)]"
            >
              {formatNumber(days)}
            </span>
            <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.42em] text-[var(--color-text-muted)]">
              Días juntos
            </span>
            <span className="sr-only">{formatNumber(days)} días juntos</span>
          </div>
        )}
      </div>

      {showScrollHint && (
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]"
        >
          Deslizá ↓
        </div>
      )}
    </section>
  )
}
