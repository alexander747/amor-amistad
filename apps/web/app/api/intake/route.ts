import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createPageFromIntake, getPool } from '@/lib/db'
import { getBaseUrl, getIntakeSecret } from '@/lib/env'
import type { IntakePayload } from '@/lib/types'

export const dynamic = 'force-dynamic'

const MAX_PHOTOS = 30
const MAX_MESSAGES = 50

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function authorized(request: Request): boolean {
  const secret = getIntakeSecret()
  if (!secret) return false
  const provided = request.headers.get('x-latido-secret')
  if (!provided) return false
  const expected = Buffer.from(secret)
  const received = Buffer.from(provided)
  if (expected.length !== received.length) return false
  return timingSafeEqual(expected, received)
}

function parsePayload(
  input: unknown,
): { ok: true; payload: IntakePayload } | { ok: false; error: string } {
  if (!isRecord(input)) return { ok: false, error: 'invalid_body' }

  const code = input.code
  if (typeof code !== 'string' || code.trim().length === 0) {
    return { ok: false, error: 'missing_code' }
  }

  const coupleNames = isRecord(input.couple_names)
    ? {
        a: typeof input.couple_names.a === 'string' ? input.couple_names.a : undefined,
        b: typeof input.couple_names.b === 'string' ? input.couple_names.b : undefined,
      }
    : undefined

  const rawMessages = Array.isArray(input.messages) ? input.messages : []
  const messages = rawMessages
    .filter(isRecord)
    .filter((message) => typeof message.body === 'string' && message.body.trim().length > 0)
    .slice(0, MAX_MESSAGES)
    .map((message, index) => ({
      body: message.body as string,
      origin: message.origin === 'ai' ? ('ai' as const) : ('client' as const),
      position: typeof message.position === 'number' ? message.position : index,
    }))

  const rawPhotos = Array.isArray(input.photos) ? input.photos : []
  const photos = rawPhotos
    .filter(isRecord)
    .filter((photo) => typeof photo.url === 'string' && photo.url.length > 0)
    .slice(0, MAX_PHOTOS)
    .map((photo, index) => ({
      url: photo.url as string,
      r2_key: typeof photo.r2_key === 'string' ? photo.r2_key : undefined,
      alt: typeof photo.alt === 'string' ? photo.alt : undefined,
      position: typeof photo.position === 'number' ? photo.position : index,
    }))

  const payload: IntakePayload = {
    code: code.trim(),
    template_slug:
      typeof input.template_slug === 'string' && input.template_slug.length > 0
        ? input.template_slug
        : 'midnight-letter',
    couple_names: coupleNames,
    anniversary_date:
      typeof input.anniversary_date === 'string' && input.anniversary_date.length > 0
        ? input.anniversary_date
        : null,
    youtube_url:
      typeof input.youtube_url === 'string' ? input.youtube_url : null,
    theme: isRecord(input.theme) ? input.theme : {},
    messages,
    photos,
  }

  return { ok: true, payload }
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = parsePayload(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const client = await getPool().connect()
  try {
    const result = await createPageFromIntake(parsed.payload, client)
    return NextResponse.json({
      ok: true,
      slug: result.slug,
      url: `${getBaseUrl()}/s/${result.slug}`,
      created: result.created,
    })
  } catch (error) {
    console.error('[latido] intake failed', error)
    return NextResponse.json({ error: 'intake_failed' }, { status: 500 })
  } finally {
    client.release()
  }
}
