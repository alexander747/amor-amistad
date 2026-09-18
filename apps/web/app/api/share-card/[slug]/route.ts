import { ImageResponse } from 'next/og'
import { daysTogether } from '@/lib/dates'
import { getPageBySlug } from '@/lib/db'
import { getBaseUrl, getBrandName } from '@/lib/env'
import { renderShareCard } from '@/components/ShareCardImage'
import type { PageData } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const WIDTH = 1080
const HEIGHT = 1920

type RouteContext = { params: Promise<{ slug: string }> }

async function loadPage(slug: string): Promise<PageData | null> {
  try {
    return await getPageBySlug(slug)
  } catch (error) {
    console.error('[latido] share-card getPageBySlug failed', error)
    return null
  }
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > 7_000_000) return null
    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params
  const data = await loadPage(slug)
  const brand = getBrandName()
  const baseUrl = getBaseUrl().replace(/^https?:\/\//, '')

  const names = (() => {
    const { a, b } = data?.page.couple_names ?? {}
    const parts = [a, b].filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )
    return parts.length > 0 ? parts.join(' & ') : 'Nuestra historia'
  })()

  const days = daysTogether(data?.page.anniversary_date)
  const photoSrc = data?.photos?.[0]?.url ? await fetchAsDataUrl(data.photos[0].url) : null

  return new ImageResponse(renderShareCard({ brand, names, days, photoSrc, baseUrl }), {
    width: WIDTH,
    height: HEIGHT,
    headers: {
      'cache-control': 'public, max-age=300, s-maxage=3600',
      'content-disposition': `inline; filename="latido-${slug}.png"`,
    },
  })
}
