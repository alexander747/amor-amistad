import type { ReactElement } from 'react'
import { formatNumber } from '@/lib/dates'

/**
 * Tarjeta de historia 1080x1920 para Instagram/WhatsApp.
 * Vive en un .tsx porque contiene JSX: `next/og` lo consume desde
 * `app/api/share-card/[slug]/route.ts`, que debe permanecer sin JSX.
 *
 * Restricciones Satori: solo flexbox, sin grid; fondos planos o gradientes.
 */

const BG = '#0B0B0C'
const SURFACE = '#1F1B16'
const PAPER = '#F5F1E8'
const BRASS = '#C8A24B'
const MUTED = '#A9A29A'

export type ShareCardProps = {
  brand: string
  names: string
  days: number | null
  photoSrc: string | null
  baseUrl: string
}

export function renderShareCard({
  brand,
  names,
  days,
  photoSrc,
  baseUrl,
}: ShareCardProps): ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        padding: 64,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          borderRadius: 32,
          border: '1px solid rgba(200,162,75,0.35)',
          background: `linear-gradient(160deg, ${SURFACE} 0%, ${BG} 60%)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '48px 56px',
          }}
        >
          <span style={{ display: 'flex', fontSize: 30, color: PAPER, fontWeight: 700 }}>
            {brand}
          </span>
          <span
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: BRASS,
            }}
          >
            Sorpresa
          </span>
        </div>

        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
            alt=""
            width={952}
            height={900}
            style={{
              width: 952,
              height: 900,
              objectFit: 'cover',
              margin: '0 56px',
              borderRadius: 24,
              border: '1px solid rgba(200,162,75,0.35)',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              height: 900,
              margin: '0 56px',
              borderRadius: 24,
              border: '1px solid rgba(200,162,75,0.35)',
              background: `linear-gradient(135deg, ${SURFACE}, ${BG})`,
            }}
          />
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            padding: '48px 56px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 80,
              lineHeight: 1.02,
              fontWeight: 700,
              color: PAPER,
              letterSpacing: -1,
            }}
          >
            {names}
          </div>
          {days !== null && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 28 }}>
              <span style={{ display: 'flex', fontSize: 96, color: BRASS, fontWeight: 700 }}>
                {formatNumber(days)}
              </span>
              <span
                style={{
                  display: 'flex',
                  fontSize: 26,
                  letterSpacing: 5,
                  textTransform: 'uppercase',
                  color: MUTED,
                }}
              >
                días juntos
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '40px 56px 56px',
            borderTop: '1px solid rgba(200,162,75,0.25)',
            margin: '40px 56px 0',
          }}
        >
          <span style={{ display: 'flex', fontSize: 26, color: MUTED }}>Raspá para revelar</span>
          <span style={{ display: 'flex', fontSize: 26, color: BRASS }}>{baseUrl}</span>
        </div>
      </div>
    </div>
  )
}
