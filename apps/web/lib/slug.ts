import { randomBytes } from 'node:crypto'

// RFC 4648 base32 alphabet (no padding). Uppercase so slugs survive chat apps
// that sometimes lower/upper-case links.
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

// Crockford-style alphabet without ambiguous characters (no I, L, O, U).
const ORDER_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function randomFrom(alphabet: string, length: number): string {
  const bytes = randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length]
  }
  return out
}

/**
 * Slug no adivinable de 12 caracteres base32 (PLAN §3.4).
 */
export function generateSlug(length = 12): string {
  return randomFrom(BASE32_ALPHABET, length)
}

/**
 * Código de pedido legible para el comprador (usado en Tally, ej. LAT-7F3K9M).
 */
export function generateOrderCode(length = 6): string {
  return `LAT-${randomFrom(ORDER_CODE_ALPHABET, length)}`
}
