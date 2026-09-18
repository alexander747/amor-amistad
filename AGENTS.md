# AGENTS.md — Latido

Producto: **páginas sorpresa personalizadas para parejas**, entregadas por URL única + QR imprimible.

> **Documento fuente de verdad: [`PLAN.md`](./PLAN.md).** Leerlo completo antes de tocar código. Si algo no está verificado ahí, dejar un `TODO` y preguntar — **no inventar**.

## Stack

| Capa | Tecnología |
|---|---|
| Web | Next.js 15 (App Router) + TypeScript + Tailwind v4 — `apps/web` |
| Datos | PostgreSQL 16 dedicado (contenedor `latido-db`) |
| Orquestación | n8n 2.37.10 existente (`posfinal-n8n`) — `infra/n8n` |
| Media | Cloudflare R2 |
| Pago | Mercado Pago Checkout Pro (COP) |
| Intake | Tally (free) |
| Edge/TLS | Caddy 2 existente (`posfinal-caddy`) |
| Infra | Docker — `infra/docker-compose.yml` |

## Estructura

```
apps/web/            # Next.js (landing + página sorpresa + APIs)
infra/               # docker-compose, snippet de Caddy, workflows n8n
openspec/            # SDD (specs y changes)
skills/              # skills de proyecto
PLAN.md              # fuente de verdad
```

## Comandos

```bash
# desarrollo del web
cd apps/web && npm install && npm run dev

# infra (en la VPS, desde infra/)
docker compose up -d --build

# recargar Caddy tras editar el Caddyfile
docker exec posfinal-caddy caddy reload --config /etc/caddy/Caddyfile
```

## Reglas del proyecto

1. **UI en español** (público Colombia/LATAM), con tildes correctas. **Código en inglés.**
2. **Mobile-first** y accesible: sin scroll horizontal a 320 px, foco visible, `alternate text`, `prefers-reduced-motion`.
3. **NUNCA condicionar el contenido a compartir / dar like / etiquetar** (Meta Dev Policy §2.7). El share es opcional y posterior al valor entregado.
4. **Video: solo embed de YouTube.** Nunca archivos de audio/video propios.
5. **Fotos en R2**, nunca en el disco de la VPS.
6. **SSR obligatorio** para Open Graph.
7. **Sin secretos en el repo.** Todo por variables de entorno (`.env.example`).
8. **No romper el stack `posfinal-*`.** Solo se agrega un bloque al Caddyfile, con backup previo.
9. Páginas `noindex` y slug no adivinable (privacidad de la pareja).
10. Webhooks **idempotentes**.

## Gotchas

- **Caddy resuelve por nombre de contenedor**: usar `latido-web:3000` en el bloque de Caddy, no `localhost`.
- **Sin swap en la VPS**: crear swapfile de 2 GB antes de builds pesados.
- **`navigator.share` no elige destino** y **Firefox desktop no comparte archivos** → siempre ofrecer "Descargar".
- **`next/og`**: solo flexbox, bundle Satori ≤ 500 KB, OG ≤ 8 MB.
- **Tally free**: 10 MB por foto.
- **ChatGPT/DeepSeek**: ID real del modelo = `deepseek-flash` (V4.1-Flash), base `https://api.deepseek.com`, compatible OpenAI.
