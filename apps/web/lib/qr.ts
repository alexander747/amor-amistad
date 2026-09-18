import QRCode from 'qrcode'

export type QrOptions = {
  width?: number
  margin?: number
  dark?: string
  light?: string
}

// Error correction level H (~30% tolerance) — PLAN §16, impresión.
const ERROR_CORRECTION = 'H' as const

const DEFAULTS: Required<QrOptions> = {
  width: 1024,
  margin: 4,
  dark: '#0B0B0C',
  light: '#F5F1E8',
}

export async function generateQrPngBuffer(
  text: string,
  options: QrOptions = {},
): Promise<Buffer> {
  const merged = { ...DEFAULTS, ...options }
  return QRCode.toBuffer(text, {
    type: 'png',
    errorCorrectionLevel: ERROR_CORRECTION,
    width: merged.width,
    margin: merged.margin,
    color: { dark: merged.dark, light: merged.light },
  })
}

export async function generateQrDataUrl(
  text: string,
  options: QrOptions = {},
): Promise<string> {
  const merged = { ...DEFAULTS, ...options }
  return QRCode.toDataURL(text, {
    type: 'image/png',
    errorCorrectionLevel: ERROR_CORRECTION,
    width: merged.width,
    margin: merged.margin,
    color: { dark: merged.dark, light: merged.light },
  })
}

export async function generateQrSvg(text: string, options: QrOptions = {}): Promise<string> {
  const merged = { ...DEFAULTS, ...options }
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: ERROR_CORRECTION,
    width: merged.width,
    margin: merged.margin,
    color: { dark: merged.dark, light: merged.light },
  })
}
