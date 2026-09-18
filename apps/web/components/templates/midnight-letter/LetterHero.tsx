import { formatNumber } from '@/lib/dates'

type LetterHeroProps = {
  names: string
  dateLabel: string | null
  /** Real number of days — exposed to screen readers and the closing copy. */
  days: number | null
  /** Animated value currently shown (see `useCountUp`). */
  countDays: number
  className?: string
  showScrollHint?: boolean
}

/**
 * Beat 1 of the midnight-letter story. Lives in its own component so the real
 * surprise page (`/s/[slug]`) and the landing's phone preview render the exact
 * same hero instead of a look-alike mockup.
 */
export default function LetterHero({
  names,
  dateLabel,
  days,
  countDays,
  className = '',
  showScrollHint = true,
}: LetterHeroProps) {
  return (
    <section className={`story-beat hero-pad ${className}`}>
      <div className="mx-auto w-full max-w-3xl">
        <p className="eyebrow mb-6">Para {names}</p>
        <h1 className="display-fluid font-display text-[var(--color-paper)]">
          {names}
        </h1>
        {dateLabel && (
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            Juntos desde el {dateLabel}
          </p>
        )}
        {days !== null && (
          <div className="mt-10 flex items-end gap-4 border-t border-[var(--color-border)] pt-8">
            <span
              className="days-number font-display leading-none text-[var(--color-accent)]"
              aria-hidden="true"
            >
              {formatNumber(countDays)}
            </span>
            <span className="pb-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              días
              <br />
              juntos
            </span>
            <span className="sr-only">{formatNumber(days)} días juntos</span>
          </div>
        )}
      </div>
      {showScrollHint && (
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]"
        >
          Desliza ↓
        </div>
      )}
    </section>
  )
}
