import { NextResponse } from 'next/server'
import { isEventType, recordEventBySlug, requestMeta } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { slug, type } = (payload ?? {}) as { slug?: unknown; type?: unknown }

  if (typeof slug !== 'string' || slug.length === 0 || slug.length > 128) {
    return NextResponse.json({ error: 'invalid_slug' }, { status: 400 })
  }
  if (!isEventType(type)) {
    return NextResponse.json({ error: 'invalid_type' }, { status: 400 })
  }

  try {
    await recordEventBySlug(slug, type, requestMeta(request.headers))
  } catch (error) {
    console.error('[latido] recordEvent failed', error)
    // Analytics nunca debe romper la experiencia del receptor.
    return NextResponse.json({ ok: false }, { status: 202 })
  }

  return NextResponse.json({ ok: true })
}
