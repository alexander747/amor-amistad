import Link from 'next/link'
import { getBrandName } from '@/lib/env'

export default function SurpriseNotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-4">Sorpresa no disponible</p>
      <h1 className="font-display text-[clamp(2rem,8vw,3.5rem)] text-[var(--color-paper)]">
        Este link no está activo
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
        Puede que la dirección esté incompleta o que la página ya no esté
        publicada. Revisá el enlace que te compartieron.
      </p>
      <Link href="/" className="btn btn-brass mt-9">
        Conocé {getBrandName()}
      </Link>
    </main>
  )
}
