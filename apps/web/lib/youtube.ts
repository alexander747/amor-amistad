const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * Extrae el video id de una URL de YouTube. Solo se aceptan dominios de YouTube
 * (PLAN §3.1: nunca archivos de audio/video propios).
 */
export function extractYouTubeId(raw: string | null | undefined): string | null {
  if (!raw) return null
  const value = raw.trim()
  if (YOUTUBE_ID.test(value)) return value

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  const allowed = [
    'youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'youtu.be',
    'youtube-nocookie.com',
  ]
  if (!allowed.includes(host)) return null

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1)
    return YOUTUBE_ID.test(id) ? id : null
  }

  if (url.pathname === '/watch') {
    const id = url.searchParams.get('v')
    return id && YOUTUBE_ID.test(id) ? id : null
  }

  const embedMatch = url.pathname.match(/^\/(embed|shorts|v)\/([A-Za-z0-9_-]{11})/)
  if (embedMatch) return embedMatch[2]

  return null
}

export function youtubeEmbedUrl(id: string): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}
