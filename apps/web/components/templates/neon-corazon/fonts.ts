import { Outfit, Sora } from 'next/font/google'

/**
 * Typography for the neon-corazon template only.
 *
 * Deliberately NOT declared in `app/layout.tsx`: the landing and the
 * midnight-letter template must not download or render these fonts. The
 * registry imports this template lazily, so this CSS ships with its chunk.
 */
export const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-neon-display',
})

export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-neon-body',
})
