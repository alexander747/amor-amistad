import { Pool, type PoolClient } from 'pg'
import type {
  IntakeMessageInput,
  IntakePayload,
  IntakePhotoInput,
  PageData,
  PageMessage,
  PagePhoto,
  PageRecord,
} from '@/lib/types'
import { generateOrderCode, generateSlug } from '@/lib/slug'

declare global {
  // eslint-disable-next-line no-var
  var __latidoPool: Pool | undefined
}

export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Check PLAN.md §20 and your .env file.',
    )
  }
  if (!global.__latidoPool) {
    global.__latidoPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
  }
  return global.__latidoPool
}

type Queryable = Pick<Pool, 'query'> | Pick<PoolClient, 'query'>

export async function getPageBySlug(
  slug: string,
  db: Queryable = getPool(),
): Promise<PageData | null> {
  const pageResult = await db.query<PageRecord>(
    // `anniversary_date::text` devuelve 'YYYY-MM-DD' (string) en vez de un
    // objeto Date: evita el corrimiento de un día por zona horaria al calcular
    // los "días juntos". Ver lib/dates.ts y la lección de pos-final.
    `SELECT id, order_id, slug, template_slug, couple_names,
            anniversary_date::text AS anniversary_date,
            youtube_url, theme, published_at, expires_at, created_at
       FROM pages
      WHERE slug = $1
      LIMIT 1`,
    [slug],
  )

  const page = pageResult.rows[0]
  if (!page) return null

  const [messagesResult, photosResult] = await Promise.all([
    db.query<PageMessage>(
      `SELECT id, body, position, origin
         FROM messages
        WHERE page_id = $1
        ORDER BY position ASC, id ASC`,
      [page.id],
    ),
    db.query<PagePhoto>(
      `SELECT id, url, r2_key, position, alt
         FROM photos
        WHERE page_id = $1
        ORDER BY position ASC, id ASC`,
      [page.id],
    ),
  ])

  return {
    page,
    messages: messagesResult.rows,
    photos: photosResult.rows,
  }
}

export type IntakeResult = {
  pageId: string
  slug: string
  created: boolean
}

function normalizeOrderCode(code: string): string {
  return code.trim().toUpperCase()
}

/**
 * Crea (o completa) la página a partir del intake mapeado por n8n (WF2).
 * Idempotente por `orders.code`: si la orden ya tiene página, la reutiliza.
 */
export async function createPageFromIntake(
  payload: IntakePayload,
  db: PoolClient,
): Promise<IntakeResult> {
  const code = normalizeOrderCode(payload.code)

  await db.query('BEGIN')
  try {
    const orderResult = await db.query<{ id: string }>(
      `SELECT id FROM orders WHERE code = $1 LIMIT 1`,
      [code],
    )
    let orderId = orderResult.rows[0]?.id

    if (!orderId) {
      // LA orden no existe: se crea como pago confirmado fuera de banda.
      // Ver TODO(latido): confirmar si el intake debe rechazar órdenes ausentes.
      const generated = generateOrderCode()
      const inserted = await db.query<{ id: string }>(
        `INSERT INTO orders (code, status, buyer_email, template_slug)
         VALUES ($1, 'paid', NULL, $2)
         RETURNING id`,
        [generated, payload.template_slug || 'midnight-letter'],
      )
      orderId = inserted.rows[0].id
    }

    const existingPage = await db.query<{ id: string; slug: string }>(
      `SELECT id, slug FROM pages WHERE order_id = $1 LIMIT 1`,
      [orderId],
    )

    let pageId: string
    let slug: string
    let created: boolean

    if (existingPage.rows[0]) {
      pageId = existingPage.rows[0].id
      slug = existingPage.rows[0].slug
      created = false
      await db.query(
        `UPDATE pages
            SET template_slug = $2,
                couple_names = $3,
                anniversary_date = $4,
                youtube_url = $5,
                theme = $6,
                published_at = COALESCE(published_at, now())
          WHERE id = $1`,
        [
          pageId,
          payload.template_slug || 'midnight-letter',
          JSON.stringify(payload.couple_names ?? {}),
          payload.anniversary_date ?? null,
          payload.youtube_url ?? null,
          JSON.stringify(payload.theme ?? {}),
        ],
      )
      await db.query(`DELETE FROM messages WHERE page_id = $1`, [pageId])
      await db.query(`DELETE FROM photos WHERE page_id = $1`, [pageId])
    } else {
      pageId = crypto.randomUUID()
      slug = generateSlug(12)
      created = true
      await db.query(
        `INSERT INTO pages
           (id, order_id, slug, template_slug, couple_names, anniversary_date,
            youtube_url, theme, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())`,
        [
          pageId,
          orderId,
          slug,
          payload.template_slug || 'midnight-letter',
          JSON.stringify(payload.couple_names ?? {}),
          payload.anniversary_date ?? null,
          payload.youtube_url ?? null,
          JSON.stringify(payload.theme ?? {}),
        ],
      )
    }

    await insertMessages(db, pageId, payload.messages ?? [])
    await insertPhotos(db, pageId, payload.photos ?? [])

    await db.query(
      `UPDATE orders
          SET status = 'ready', delivered_at = COALESCE(delivered_at, now())
        WHERE id = $1`,
      [orderId],
    )

    await db.query('COMMIT')
    return { pageId, slug, created }
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  }
}

async function insertMessages(
  db: PoolClient,
  pageId: string,
  messages: IntakeMessageInput[],
): Promise<void> {
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i]
    if (!message?.body) continue
    await db.query(
      `INSERT INTO messages (page_id, body, position, origin)
       VALUES ($1, $2, $3, $4)`,
      [pageId, message.body, message.position ?? i, message.origin ?? 'client'],
    )
  }
}

async function insertPhotos(
  db: PoolClient,
  pageId: string,
  photos: IntakePhotoInput[],
): Promise<void> {
  for (let i = 0; i < photos.length; i += 1) {
    const photo = photos[i]
    if (!photo?.url) continue
    await db.query(
      `INSERT INTO photos (page_id, r2_key, url, position, alt)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        pageId,
        photo.r2_key ?? '',
        photo.url,
        photo.position ?? i,
        photo.alt ?? null,
      ],
    )
  }
}
