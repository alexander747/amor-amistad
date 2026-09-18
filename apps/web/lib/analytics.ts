import { createHash } from 'node:crypto'
import { getPool } from '@/lib/db'
import type { EventType } from '@/lib/types'

const ALLOWED_EVENTS: ReadonlySet<string> = new Set<EventType>([
  'view',
  'reveal',
  'share',
  'cta_click',
])

export function isEventType(value: unknown): value is EventType {
  return typeof value === 'string' && ALLOWED_EVENTS.has(value)
}

/**
 * Hash con sal de la IP. Nunca se guarda la IP cruda (PLAN §22/§23).
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null
  const salt =
    process.env.ANALYTICS_SALT ||
    process.env.TALLY_WEBHOOK_SECRET ||
    'latido-analytics'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

export type EventMeta = {
  userAgent?: string | null
  referrer?: string | null
  ip?: string | null
}

export async function recordEventBySlug(
  slug: string,
  type: EventType,
  meta: EventMeta = {},
): Promise<void> {
  if (!isEventType(type)) return
  const pool = getPool()
  await pool.query(
    `INSERT INTO events (page_id, type, user_agent, referrer, ip_hash)
     SELECT id, $2, $3, $4, $5
       FROM pages
      WHERE slug = $1`,
    [
      slug,
      type,
      meta.userAgent?.slice(0, 512) ?? null,
      meta.referrer?.slice(0, 512) ?? null,
      hashIp(meta.ip),
    ],
  )
}

export function requestMeta(headers: Headers): EventMeta {
  const forwarded = headers.get('x-forwarded-for')
  return {
    userAgent: headers.get('user-agent'),
    referrer: headers.get('referer'),
    ip: forwarded ? forwarded.split(',')[0].trim() : null,
  }
}
