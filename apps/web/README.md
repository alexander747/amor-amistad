# Latido — web

Aplicación Next.js 15 (App Router) + TypeScript + Tailwind v4 que sirve la
**landing de venta** (`/`) y la **página sorpresa** (`/s/[slug]`) descritas en
[`PLAN.md`](../../PLAN.md).

## Requisitos

- Node.js 22+
- npm 10+
- PostgreSQL 16 accesible (contenedor `latido-db` en la VPS)

## Puesta en marcha

```bash
cd apps/web
npm install
npm run dev
```

La app queda en `http://localhost:3000`.

### Variables de entorno

Todas se leen de `process.env` (nunca hay secretos en el repo). Nombres según
PLAN.md §20. Para desarrollo local alcanza con un `.env.local`:

```dotenv
NEXT_PUBLIC_BRAND_NAME=Latido
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_META_PIXEL_ID=
DATABASE_URL=postgres://latido:cambiar_esto@localhost:5432/latido

# CTA de compra (fase 0)
NEXT_PUBLIC_MP_CHECKOUT_URL=

# Shared secret que usa n8n para llamar a /api/intake
TALLY_WEBHOOK_SECRET=cambiar_esto
```

> `NEXT_PUBLIC_MP_CHECKOUT_URL` es una variable **nueva** para el link de pago:
> PLAN.md §13/§24 marca el link/precio como `TODO`/`BLOQUEANTE`.

Sin `DATABASE_URL` la landing sigue funcionando; las rutas que tocan la base
devuelven 404 / fallback de forma controlada.

## Estructura

```
app/
  page.tsx                       # landing de venta (Meta Pixel + CTA MP)
  s/[slug]/page.tsx              # página sorpresa SSR (noindex)
  s/[slug]/opengraph-image.tsx   # OG dinámico 1200x630 (next/og)
  api/intake/route.ts            # POST de n8n -> crea page/messages/photos
  api/share-card/[slug]/route.ts # PNG 1080x1920 para historias
  api/events/route.ts            # view | reveal | share | cta_click
components/
  ScratchGate.tsx                # canvas "raspá para revelar" (PLAN §9.2)
  ShareCard.tsx                  # navigator.share + Descargar siempre visible
  templates/midnight-letter/     # plantilla data-driven
lib/
  db.ts  r2.ts  qr.ts  analytics.ts  # pg, R2 (S3), QR (H), eventos
```

## Comandos

```bash
npm run dev        # desarrollo
npm run typecheck  # tsc --noEmit
npm run build      # build de producción (output: standalone)
npm run start      # servir el build
```

## Docker

El **contexto es la raíz del repo** (PLAN §18.3), porque `Dockerfile` copia
`apps/web/`:

```bash
# desde la raíz del repo
docker build -f apps/web/Dockerfile -t latido-web .
```

La imagen usa `output: 'standalone'`, corre como usuario no-root (`nextjs:1001`),
no publica puertos al host y expone `3000` para que Caddy lo alcance por el
nombre de contenedor `latido-web`.

## API

### `POST /api/intake`

Lo llama n8n (WF2) con el intake ya mapeado. Requiere el header
`x-latido-secret` (valor de `TALLY_WEBHOOK_SECRET`).

```jsonc
{
  "code": "LAT-7F3K9M",
  "template_slug": "midnight-letter",
  "couple_names": { "a": "Mariana", "b": "Julián" },
  "anniversary_date": "2022-09-21",
  "youtube_url": "https://www.youtube.com/watch?v=...",
  "theme": {},
  "messages": [{ "body": "…", "origin": "client" }],
  "photos": [{ "url": "https://media.uniongloss.com/pages/…", "r2_key": "…" }]
}
```

Respuesta: `{ "ok": true, "slug": "…", "url": "…", "created": true }`.
Es idempotente por `orders.code`.

### `POST /api/events`

`{ "slug": "…", "type": "view" | "reveal" | "share" | "cta_click" }`.

## TODO / pendientes

- `TODO(latido)`: precio final y link de Mercado Pago (PLAN §13/§24).
- `TODO(latido)`: fuente de marca (Fraunces) en las imágenes `next/og`; hoy usa
  la fuente por defecto de Satori para no inflar el bundle.
- `TODO(latido)`: confirmar el flujo definitivo de subida a R2 (n8n vs. web).
- `TODO(latido)`: nombre canónico del env del shared secret de intake.
