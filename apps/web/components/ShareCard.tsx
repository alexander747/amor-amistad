'use client'

import { useCallback, useState } from 'react'
import { trackEvent } from '@/lib/analytics-client'

type ShareCardProps = {
  slug: string
  shareTitle?: string
  shareText?: string
  className?: string
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export default function ShareCard({
  slug,
  shareTitle = 'Nuestra historia',
  shareText = 'Mirá la sorpresa que me hicieron 💛',
  className = '',
}: ShareCardProps) {
  const [busy, setBusy] = useState(false)

  const fetchCard = useCallback(async (): Promise<Blob> => {
    const response = await fetch(`/api/share-card/${slug}`, {
      headers: { accept: 'image/png' },
    })
    if (!response.ok) throw new Error('No se pudo generar la tarjeta')
    return response.blob()
  }, [slug])

  const handleDownload = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      const blob = await fetchCard()
      downloadBlob(blob, `latido-${slug}.png`)
    } catch {
      // Fallback duro: abrir el endpoint en una pestaña nueva.
      window.open(`/api/share-card/${slug}`, '_blank', 'noopener')
    } finally {
      setBusy(false)
    }
  }, [busy, fetchCard, slug])

  const handleShare = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      const blob = await fetchCard()
      const file = new File([blob], `latido-${slug}.png`, {
        type: blob.type || 'image/png',
      })
      const canShareFiles =
        typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })

      if (canShareFiles && typeof navigator.share === 'function') {
        await navigator.share({ files: [file], title: shareTitle, text: shareText })
        trackEvent(slug, 'share')
      } else {
        // Firefox desktop y otros no comparten archivos: siempre descargamos.
        downloadBlob(blob, `latido-${slug}.png`)
      }
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') {
        // El usuario canceló o falló: no rompemos la experiencia.
      }
    } finally {
      setBusy(false)
    }
  }, [busy, fetchCard, shareText, shareTitle, slug])

  return (
    <div className={`flex flex-col items-center gap-3 sm:flex-row sm:justify-center ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        disabled={busy}
        aria-busy={busy}
        className="btn btn-brass w-full sm:w-auto"
      >
        Compartir historia
      </button>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        aria-busy={busy}
        className="btn btn-outline w-full sm:w-auto"
      >
        Descargar
      </button>
    </div>
  )
}
