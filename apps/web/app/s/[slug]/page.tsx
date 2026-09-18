import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import MidnightLetter from '@/components/templates/midnight-letter/MidnightLetter'
import { daysTogether } from '@/lib/dates'
import { getPageBySlug } from '@/lib/db'
import { getBaseUrl, getBrandName } from '@/lib/env'
import type { PageData } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type RouteParams = { params: Promise<{ slug: string }> }

// Deduplica la consulta entre generateMetadata y el render del segmento.
const loadPage = cache(async (slug: string): Promise<PageData | null> => {
  try {
    return await getPageBySlug(slug)
  } catch (error) {
    console.error('[latido] getPageBySlug failed', error)
    return null
  }
})

function isPublishedAndFresh(data: PageData | null): data is PageData {
  if (!data) return false
  if (!data.page.published_at) return false
  if (data.page.expires_at && new Date(data.page.expires_at) < new Date()) return false
  return true
}

function namesFor(data: PageData): string {
  const { a, b } = data.page.couple_names ?? {}
  const parts = [a, b].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )
  return parts.length > 0 ? parts.join(' & ') : 'Una sorpresa para alguien especial'
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params
  const data = await loadPage(slug)
  const brand = getBrandName()

  if (!isPublishedAndFresh(data)) {
    return {
      title: { absolute: `Sorpresa no encontrada · ${brand}` },
      robots: { index: false, follow: false, nocache: true },
    }
  }

  const names = namesFor(data)
  const days = daysTogether(data.page.anniversary_date)
  const description = days
    ? `${names}: ${days} días juntos en una página sorpresa hecha con ${brand}.`
    : `${names}: una página sorpresa hecha con ${brand}.`

  return {
    // `absolute` evita que el template del layout agregue "· Latido" de nuevo.
    title: { absolute: `${names} · Una sorpresa de ${brand}` },
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    alternates: { canonical: `${getBaseUrl()}/s/${slug}` },
    openGraph: {
      title: `${names} 💛`,
      description,
      type: 'website',
      url: `${getBaseUrl()}/s/${slug}`,
      siteName: brand,
    },
    twitter: { card: 'summary_large_image', title: `${names} 💛`, description },
  }
}

export default async function SurprisePage({ params }: RouteParams) {
  const { slug } = await params
  const data = await loadPage(slug)

  if (!isPublishedAndFresh(data)) notFound()

  return <MidnightLetter data={data} />
}
