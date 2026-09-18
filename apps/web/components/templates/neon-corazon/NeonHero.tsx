import { formatNumber } from '@/lib/dates'

type NeonHeroProps = {
  names: string
  dateLabel: string | null
  /** Real number of days — exposed to screen readers. */
  days: number | null
  /** Animated value currently shown (see `useCountUp`). */
  countDays: number
  className?: string
  showScrollHint?: boolean
}

/**
 * Beat 1 of the neon-corazon story. The only beat that claims the full
 * viewport: names in gradient type, the anniversary and the days-together stat
 * as the oversized centerpiece.
 */
export default function NeonHero({
  names,
  dateLabel,
  days,
  countDays,
  className = '',
  showScrollHint = true,
}: NeonHeroProps) {
  return (
    <section
      className={`story-beat story-beat-full neon-aurora hero-pad relative isolate overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-[-12%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,0,153,0.5),transparent_66%)] blur-3xl neon-float"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-[14%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(127,0,255,0.55),transparent_66%)] blur-3xl neon-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.35),transparent_68%)] blur-3xl neon-float"
      />

      <div className="relative mx-auto w-full max-w-3xl">
        <p className="eyebrow mb-5">Para {names}</p>
        <h1 className="neon-display neon-text-gradient neon-animate-gradient font-display break-words">
          {names}
        </h1>
        {dateLabel && (
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            Juntos desde el {dateLabel}
          </p>
        )}

        {days !== null && (
          <div className="mt-9 sm:mt-11">
            <div className="neon-card rounded-[var(--radius-lg)] px-6 py-7 sm:px-8 sm:py-9">
              <span className="eyebrow">Días juntos</span>
              <div className="mt-2 flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="neon-days neon-text-gradient neon-animate-gradient font-display leading-none"
                >
                  {formatNumber(countDays)}
                </span>
              </div>
              <span className="sr-only">{formatNumber(days)} días juntos</span>
            </div>
          </div>
        )}
      </div>

      {showScrollHint && (
        <div
          aria-hidden="true"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]"
        >
          Deslizá ↓
        </div>
      )}
    </section>
  )
}
