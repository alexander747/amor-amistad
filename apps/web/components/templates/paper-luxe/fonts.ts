import { Cormorant_Garamond, Jost } from 'next/font/google'

/**
 * Typography for the paper-luxe template only.
 *
 * Deliberately NOT declared in `app/layout.tsx`: routes that never render this
 * template must not download or render these fonts. The registry imports the
 * template lazily, so this CSS ships with its chunk.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-paper-display',
})

export const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
  variable: '--font-paper-body',
})
