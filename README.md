# Latido

**Sorpresas que se sienten.** Páginas sorpresa personalizadas para parejas: el comprador paga, entrega fotos, mensajes y un video de YouTube, y su pareja recibe un link/QR con una experiencia interactiva y compartible.

- Dominio: `https://amor.uniongloss.com`
- Plan completo y especificación: **[`PLAN.md`](./PLAN.md)**
- Convenciones para agentes: **[`AGENTS.md`](./AGENTS.md)**

## Quick start

```bash
# 1. Variables de entorno
cp .env.example .env      # completar credenciales

# 2. Desarrollo del sitio
cd apps/web
npm install
npm run dev               # http://localhost:3000

# 3. Infra (en la VPS)
cd ../../infra
docker compose up -d --build
```

## Estructura

| Ruta | Qué es |
|---|---|
| `apps/web` | Next.js: landing de venta + página sorpresa `/s/[slug]` |
| `infra/docker-compose.yml` | `web` + `postgres` sobre la red del salón |
| `infra/caddy/` | Snippet para el Caddyfile existente |
| `infra/n8n/` | Workflows (Mercado Pago, Tally, QR) |
| `openspec/` | Specs (SDD) |
| `skills/` | Skills de proyecto |

## Estado

- [x] Plan y arquitectura (`PLAN.md`)
- [ ] Fase 0 — landing + pago + 1 plantilla + QR (MVP pautable)
- [ ] Fase 1 — webhooks automatizados + R2 + OG
- [ ] Fase 2 — plantillas extra + IA + grupos
