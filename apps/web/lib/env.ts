export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL
  if (raw && raw.length > 0) return raw.replace(/\/$/, '')
  return 'https://amor.uniongloss.com'
}

export function getBrandName(): string {
  return process.env.NEXT_PUBLIC_BRAND_NAME || 'Latido'
}

export function getMetaPixelId(): string | null {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID
  return id && id.length > 0 ? id : null
}

/**
 * Shared secret used by n8n to POST /api/intake.
 * PLAN §20 does not define a dedicated intake secret, so we accept either
 * TALLY_WEBHOOK_SECRET or INTAKE_SHARED_SECRET and require one of them.
 *
 * TODO(latido): confirm the canonical env var name for the intake shared secret.
 */
export function getIntakeSecret(): string | null {
  return (
    process.env.INTAKE_SHARED_SECRET || process.env.TALLY_WEBHOOK_SECRET || null
  )
}

export function getDatabaseUrl(): string | null {
  return process.env.DATABASE_URL || null
}

/**
 * Destino del CTA de compra.
 *
 * TODO(latido): PLAN §13/§24 — el precio final y el link de Mercado Pago están
 * BLOQUEANTES/TODO. Fase 0 usa un Link de pago; fase 1, Checkout Pro con
 * `external_reference`. Reemplazar por el link real.
 */
export function getCheckoutUrl(): string {
  return process.env.NEXT_PUBLIC_MP_CHECKOUT_URL || '#crear'
}
