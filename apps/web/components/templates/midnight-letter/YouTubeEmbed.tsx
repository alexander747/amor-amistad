import { extractYouTubeId, youtubeEmbedUrl } from '@/lib/youtube'

type YouTubeEmbedProps = {
  url: string | null | undefined
  title?: string
}

export default function YouTubeEmbed({
  url,
  title = 'Video de la sorpresa',
}: YouTubeEmbedProps) {
  const id = extractYouTubeId(url)
  if (!id) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-black">
      <iframe
        src={youtubeEmbedUrl(id)}
        title={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}
