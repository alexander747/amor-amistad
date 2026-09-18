const MS_PER_DAY = 86_400_000

export function parseDateOnly(value: string | Date | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null
    // `pg` devuelve las columnas DATE como Date a medianoche LOCAL. Usar los
    // getters locales evita el corrimiento de un día por zona horaria.
    return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()))
  }
  const parsed = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Días juntos desde la fecha de aniversario. Si la fecha es futura devuelve 0.
 */
export function daysTogether(
  anniversary: string | Date | null | undefined,
  now: Date = new Date(),
): number | null {
  const start = parseDateOnly(anniversary)
  if (!start) return null
  const diff = Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY)
  return diff > 0 ? diff : 0
}

const DATE_FORMATTER = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatLongDate(value: string | Date | null | undefined): string | null {
  const date = parseDateOnly(value)
  return date ? DATE_FORMATTER.format(date) : null
}

const NUMBER_FORMATTER = new Intl.NumberFormat('es-CO')

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value)
}
