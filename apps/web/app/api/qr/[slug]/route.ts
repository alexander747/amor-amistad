import QRCode from 'qrcode'

import { getBaseUrl } from '@/lib/env'

/**
 * QR imprimible de una página sorpresa.
 *
 * Vive acá (y no en n8n) a propósito: `node-qrcode` ya es dependencia de la app,
 * y así n8n no necesita instalar módulos externos
 * (`NODE_FUNCTION_ALLOW_EXTERNAL`), que en el n8n compartido del salón no
 * están disponibles.
 *
 * Corrección de error H (~30%) y quiet zone de 4 módulos: apto para impresión
 * (PLAN §16).
 */

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ slug: string }> }

const SLUG_RE = /^[A-Za-z0-9-]{4,64}$/

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params

  if (!SLUG_RE.test(slug)) {
    return new Response('Slug inválido', { status: 400 })
  }

  const base = getBaseUrl().replace(/\/+$/, '')
  const target = `${base}/s/${slug}`

  // Sin `?w=` el default es 1024 px (bueno para imprimir).
  // Ojo: `Number(null)` es 0, así que hay que chequear el string crudo.
  const rawWidth = new URL(request.url).searchParams.get('w')
  const requested = rawWidth ? Number(rawWidth) : Number.NaN
  const width = Number.isFinite(requested)
    ? Math.min(2048, Math.max(256, requested))
    : 1024

  try {
    const png = await QRCode.toBuffer(target, {
      type: 'png',
      errorCorrectionLevel: 'H',
      margin: 4,
      width,
      // Contraste alto sobre blanco: es lo que mejor escanean las cámaras
      // y lo que mejor imprime una impresora hogareña.
      color: { dark: '#0B0B0C', light: '#FFFFFFFF' },
    })

    return new Response(new Uint8Array(png), {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[latido] no se pudo generar el QR', error)
    return new Response('No se pudo generar el QR', { status: 500 })
  }
}
