import { ImageResponse } from 'next/og'
import { daysTogether, formatNumber } from '@/lib/dates'
import { getPageBySlug } from '@/lib/db'
import { getBrandName } from '@/lib/env'
import type { PageData } from '@/lib/types'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Página sorpresa personalizada de Latido'

const BG = '#0B0B0C'
const SURFACE = '#1F1B16'
const PAPER = '#F5F1E8'
const BRASS = '#C8A24B'
const MUTED = '#A9A29A'

async function loadPage(slug: string): Promise<PageData | null> {
  try {
    return await getPageBySlug(slug)
  } catch (error) {
    console.error('[latido] OG getPageBySlug failed', error)
    return null
  }
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await response.arrayBuffer())
    // OG total (imagen incluida) debe quedar por debajo de 8 MB — PLAN §7.
    if (buffer.byteLength > 5_500_000) return null
    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await loadPage(slug)
  const brand = getBrandName()

  const names = (() => {
    const { a, b } = data?.page.couple_names ?? {}
    const parts = [a, b].filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )
    return parts.length > 0 ? parts.join(' & ') : 'Una sorpresa especial'
  })()

  const days = daysTogether(data?.page.anniversary_date)
  const photoUrl = data?.photos?.[0]?.url
  const photoSrc = photoUrl ? await fetchAsDataUrl(photoUrl) : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: BG,
          padding: 48,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1px solid rgba(200,162,75,0.35)`,
            borderRadius: 24,
            padding: 56,
            background: `linear-gradient(135deg, ${SURFACE} 0%, ${BG} 70%)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 20,
                letterSpacing: 6,
                textTransform: 'uppercase',
                color: BRASS,
              }}
            >
              {brand} · Sorpresa para
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 78,
                  lineHeight: 1.02,
                  color: PAPER,
                  fontWeight: 700,
                  letterSpacing: -1,
                }}
              >
                {names}
              </div>
              {days !== null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 16,
                    marginTop: 28,
                  }}
                >
                  <div style={{ display: 'flex', fontSize: 84, color: BRASS, fontWeight: 700 }}>
                    {formatNumber(days)}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 24,
                      color: MUTED,
                      letterSpacing: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    días juntos
                  </div>
                </div>
              )}
            </div>

            {photoSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoSrc}
                alt=""
                width={320}
                height={400}
                style={{
                  width: 320,
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 18,
                  border: `1px solid rgba(200,162,75,0.4)`,
                }}
              />
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid rgba(200,162,75,0.25)`,
              paddingTop: 24,
              fontSize: 22,
              color: MUTED,
            }}
          >
            <span style={{ display: 'flex' }}>Raspá para revelar</span>
            <span style={{ display: 'flex', color: BRASS }}>amor.uniongloss.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
