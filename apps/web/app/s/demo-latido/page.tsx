import type { Metadata } from 'next'
import MidnightLetter from '@/components/templates/midnight-letter/MidnightLetter'
import { getBrandName } from '@/lib/env'
import type { PageData } from '@/lib/types'

/**
 * Static, safe demo used by the landing's "Ver una demo" CTA. It renders the
 * real midnight-letter template with fictional data — no database, no R2.
 * Always `noindex`: it is a showcase, not a customer page.
 */
export const metadata: Metadata = {
  title: { absolute: `Demo · ${getBrandName()}` },
  robots: { index: false, follow: false, nocache: true },
}

const DEMO_DATA: PageData = {
  page: {
    id: 'demo',
    order_id: 'demo',
    slug: 'demo-latido',
    template_slug: 'midnight-letter',
    couple_names: { a: 'Mariana', b: 'Julián' },
    anniversary_date: '2021-03-14',
    youtube_url: null,
    theme: {},
    published_at: '2026-01-01T00:00:00.000Z',
    expires_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  messages: [
    {
      id: 'demo-1',
      body: 'Hay días que se ordenan solos cuando estás. Este es uno de esos.',
      position: 0,
      origin: 'client',
    },
    {
      id: 'demo-2',
      body: 'Gracias por quedarte incluso en los días grises. Sobre todo en esos.',
      position: 1,
      origin: 'client',
    },
    {
      id: 'demo-3',
      body: 'Si vuelvo a elegir, elijo esto otra vez. Todos los días.',
      position: 2,
      origin: 'client',
    },
  ],
  photos: [],
}

export default function DemoLatidoPage() {
  return <MidnightLetter data={DEMO_DATA} />
}
