import type { ComponentType } from 'react'
import type { PageData } from '@/lib/types'

export type TemplateProps = { data: PageData }
export type TemplateComponent = ComponentType<TemplateProps>
export type TemplateLoader = () => Promise<{ default: TemplateComponent }>

export const DEFAULT_TEMPLATE_SLUG = 'midnight-letter'

/**
 * Template registry: maps `pages.template_slug` to a lazy loader. The loaders
 * keep each template (and its fonts/CSS) in its own chunk, so a page only
 * downloads the template it actually renders.
 */
export const TEMPLATE_LOADERS: Record<string, TemplateLoader> = {
  'midnight-letter': () => import('./midnight-letter/MidnightLetter'),
  'neon-corazon': () => import('./neon-corazon/NeonCorazon'),
}

export function hasTemplate(slug: string | null | undefined): boolean {
  return typeof slug === 'string' && slug in TEMPLATE_LOADERS
}

export function resolveTemplateSlug(slug: string | null | undefined): string {
  return hasTemplate(slug) ? (slug as string) : DEFAULT_TEMPLATE_SLUG
}

/**
 * Resolves the template component for a slug, falling back to the default
 * template for unknown or missing slugs.
 */
export async function loadTemplate(
  slug: string | null | undefined,
): Promise<TemplateComponent> {
  const key = resolveTemplateSlug(slug)
  const mod = await TEMPLATE_LOADERS[key]()
  return mod.default
}
