---
name: latido-design-system
description: Trigger - crear o modificar UI, plantillas o landing de Latido. Define paletas, tipografías, tokens CSS, reglas responsive y de accesibilidad, y las prohibiciones estéticas.
---

# Skill: Latido Design System

Aplicar SIEMPRE que se escriba UI para Latido (landing, plantilla `midnight-letter`, share cards, emails). La fuente de verdad extendida es `PLAN.md` §8 y §9.

## Paletas y tipografías

| Plantilla | Fase | Paleta | Fuentes (Google Fonts) |
|---|---|---|---|
| `midnight-letter` | MVP | `#0B0B0C` fondo · `#1F1B16` superficie · `#F5F1E8` papel · `#C8A24B` brass · `#A9A29A` muted | **Fraunces** (display) · **Instrument Sans** (body) · **IBM Plex Mono** (detalle) |
| `soft-luxe-paper` | F2 | `#FAF7F0` · `#1A1A1A` · `#C8B7A6` · `#A6785A` | **Cormorant Garamond** · **Jost** |
| `neon-corazon` | F2 | `#120B1A` · `#FF0099→#493240` · `#7F00FF→#E100FF` · `#00E5FF` | **Sora** · **Outfit** |

Referencia 2026: Pantone COTY "Cloud Dancer" `#F2EFE9` → usar en `soft-luxe-paper`.

## Tokens obligatorios

Usar CSS variables (ver `PLAN.md` §8.2). Nunca hardcodear colores en componentes: consumir `var(--color-*)`.
Tipografía fluida con `clamp()`. Espaciado y duración desde tokens.

## Prohibiciones (estética AI-slop)

- Gradientes índigo/violeta `#6366F1 → #8B5CF6`.
- Inter/Roboto/Arial como fuente principal.
- Glassmorphism excesivo, bordes genéricos de "SaaS".
- Space Grotesk (sobreusada).
- Layouts predecibles, centrado plano sin jerarquía.

## Reglas responsive (obligatorias)

- Mobile-first: diseñar a 360 px y escalar. Breakpoints 360/390/768/1024/1440.
- Sin scroll horizontal a 320 px.
- `100dvh` en vez de `100vh` (barras de Safari iOS).
- Imágenes con `next/image` y `sizes` correcto.
- Fuentes con `next/font` (self-host, `display: swap`).

## Accesibilidad (obligatoria)

- Contraste WCAG AA: cuerpo ≥ 4.5:1. `#C8A24B` solo en texto ≥ 18 px o elementos no textuales. **Verificar con herramienta, no asumir.**
- `prefers-reduced-motion: reduce` desactiva parallax, count-up y confeti.
- Foco visible por teclado en todo control interactivo.
- `alt` en imágenes; `aria-label` en el canvas de raspar; fallback "Revelar sin raspar".

## Animación

- **Motion** (motion.dev) para reveals; **canvas-confetti** con `disableForReducedMotion`.
- Duración de reveals 600–900 ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Un beat por viewport; scroll-snap + `IntersectionObserver`.

## Idiomas

UI y copy **en español** con tildes correctas. Identificadores de código en inglés.
