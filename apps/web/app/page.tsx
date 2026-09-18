import type { Metadata } from 'next'
import Landing from '@/components/landing/Landing'
import MetaPixel from '@/components/MetaPixel'
import { getBrandName, getCheckoutUrl, getMetaPixelId } from '@/lib/env'

export const metadata: Metadata = {
  title: `${getBrandName()} — Sorpresas que se sienten`,
  description:
    'Creá una página sorpresa personalizada con fotos, mensajes y su canción. Se entrega en un link y un QR para imprimir. Sin apps, lista para compartir.',
  alternates: { canonical: '/' },
  openGraph: {
    title: `${getBrandName()} — Sorpresas que se sienten`,
    description:
      'Fotos, mensajes y su canción en una página secreta que se revela raspando. Link + QR imprimible.',
    type: 'website',
  },
}

// TODO(latido): PLAN §13/§24 — precio final BLOQUEANTE. Rango sugerido
// $19.900–$39.900 COP; se muestra un valor intermedio hasta confirmar comisión MP.
const PRICE_LABEL = '$29.900'
const CURRENCY_LABEL = 'COP'

export default function LandingPage() {
  const pixelId = getMetaPixelId()
  const checkoutUrl = getCheckoutUrl()
  const brand = getBrandName()

  return (
    <>
      {pixelId && <MetaPixel pixelId={pixelId} />}
      <Landing
        brand={brand}
        checkoutUrl={checkoutUrl}
        price={PRICE_LABEL}
        currency={CURRENCY_LABEL}
      />
    </>
  )
}
