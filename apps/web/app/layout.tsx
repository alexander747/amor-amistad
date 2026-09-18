import type { Metadata, Viewport } from 'next'
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'
import { getBaseUrl, getBrandName } from '@/lib/env'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: `${getBrandName()} — Sorpresas que se sienten`,
    template: `%s · ${getBrandName()}`,
  },
  description:
    'Creá una página sorpresa personalizada para alguien especial: fotos, mensajes y su canción, entregada en un link y un QR para imprimir.',
  applicationName: getBrandName(),
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B0B0C',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${fraunces.variable} ${instrument.variable} ${plexMono.variable}`}>
      <body className="font-body bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  )
}
