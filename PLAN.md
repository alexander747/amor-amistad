# PLAN.md — Latido

> **Producto**: Latido — páginas sorpresa personalizadas para parejas, entregadas por URL única + QR imprimible.
> **Marca**: Latido · *"Sorpresas que se sienten"*
> **Dominio**: `https://amor.uniongloss.com`
> **Documento**: fuente de verdad para la IA implementadora. Nada se asume: lo que falta está marcado `TODO` o `BLOQUEANTE`.
> **Idioma**: documentación en español; **UI del producto en español** (público Colombia/LATAM); identificadores de código en inglés.

---

## Quick path (para la IA implementadora)

1. Crear `apps/web` (Next.js 15 App Router + TypeScript + Tailwind v4) y `infra/docker-compose.yml`.
2. Implementar la plantilla `midnight-letter` + gate "raspar" + `opengraph-image.tsx` dinámico.
3. Implementar el intake API (`POST /api/intake`) y el endpoint `/s/[slug]`.
4. Cargar los 3 workflows de n8n (`infra/n8n/*.json`) y conectar Mercado Pago + Tally.
5. Landing + Meta Pixel; verificar OG en WhatsApp; correr checklist de aceptación (§21).

**Regla de oro:** si algo no está verificado en este documento, **no lo inventes**: dejá un `TODO` y preguntá.

---

## 1. Producto y objetivo

Latido vende una **experiencia web personalizada**: el comprador paga, entrega fotos, mensajes y un video de YouTube, y su pareja recibe un link/QR con una página interactiva (gate de "raspar para revelar") que se puede **compartir en redes**. El crecimiento es por **publicidad orgánica del receptor** (bucle viral), no solo por pauta.

Dos caras del sistema:
- **A) Landing de venta** (`/`): recibe el tráfico de Facebook/Instagram Ads, explica el producto y lleva al pago.
- **B) Página sorpresa** (`/s/[slug]`): la experiencia del receptor.

Ambas viven en la misma app Next.js.

---

## 2. Objetivo del MVP (ad-ready)

**Entra en el MVP:**
1. Landing de venta + **Meta Pixel** (evento de compra).
2. Checkout **Mercado Pago** (fase 0: Link de pago; fase 1: Checkout Pro automatizado por webhook).
3. **Intake de contenido** vía Tally con código de pedido (`?code=`).
4. **1 plantilla** (`midnight-letter`) pulida, responsive y accesible.
5. **Publicación SSR** en `/s/[slug]` con **Open Graph dinámico** por pareja.
6. **Share card 1080×1920** descargable + `navigator.share` (con fallback).
7. **QR imprimible** (PNG/PDF, error correction H) entregado por email.
8. **Todo en Docker**, integrado al Caddy y la red existentes de la VPS.

**Fuera del MVP (fase 2):** plantillas `soft-luxe-paper` y `neon-corazon`, generación de mensajes con IA, panel self-service, variante grupal, analytics fino de compartidos.

---

## 3. Reglas no negociables

| # | Regla |
|---|-------|
| 1 | **Video = solo embed de YouTube.** Nunca archivos de audio/video propios (riesgo legal + ancho de banda). |
| 2 | **Fotos en Cloudflare R2.** Nunca en el disco de la VPS. |
| 3 | **SSR obligatorio** para Open Graph. Sin SSR el preview de WhatsApp no existe → no hay viralidad. |
| 4 | **`noindex` + slug no adivinable** (privacidad de la pareja). Slug = 10+ chars base32 aleatorio. |
| 5 | **Webhooks idempotentes** (MP y Tally pueden reintentar). Clave de idempotencia persistida. |
| 6 | **Webhook MP:** responder `200` en **< 22 s**, validar `x-signature` (HMAC-SHA256), aprobado = `status: "approved"`. |
| 7 | **Mobile-first** (el 90 % abre desde el celular). Breakpoints: 360 / 390 / 768 / 1024 / 1440. |
| 8 | Respetar **`prefers-reduced-motion`**; sin autoplay de audio. |
| 9 | **Cero secretos en el repo.** Todo por variables de entorno. |
| 10 | **No romper el stack del salón** (`posfinal-*`). Solo se agrega un bloque al Caddyfile con backup previo. |

---

## 4. Restricciones de Meta (críticas para pauta)

| Regla (verificada) | Consecuencia de diseño |
|---|---|
| Prohibido incentivar o condicionar **share / like / tag** (Meta Dev Policy §2.7) | El compartir es **opcional y POSTERIOR al valor entregado**. **Nunca** "compartí para ver/desbloquear". |
| Prohibido implicar **atributos personales** en anuncios | Copy **product-centric**: "Sorprendé a alguien especial". **Nunca** "tu novia/pareja/estás de novio". |
| Anuncios de **"dating"** requieren permiso escrito | Evitar cualquier framing de app de citas. |
| **Video ads**: sin tácticas disruptivas (flashing) | El reveal no puede ser estroboscópico ni con flashes rápidos. |
| El anuncio debe **coincidir con la landing** | Creativo y landing hablan del mismo producto y precio. |
| Si se usa la **Stories API**: sin logos/watermarks/CTA en la Story | El push a Stories (si se implementa) debe ser imagen limpia; el branding va fuera de la Story. |

> **Nota**: por lo anterior, el modelo de negocio **no** puede ser "página gratis, compartí para desbloquear". Alternativa permitida: branding de "hecho con Latido" en la versión base, y CTA de compartir **sin incentivo**.

---

## 5. Competencia y diferenciación

### Teardown (verificado por fetch directo)

| Competidor | País | Precio | Fuerte | Débil |
|---|---|---|---|---|
| GiftsQR | BR | $7–9 USD | 33 tipos de sorpresa; programa de afiliados 20 % | Estética genérica/emoji; sin art direction premium |
| Lovepanda | BR | $4.90–9.90 | Wrapped animado; QR; anclaje de precio 24.90→9.90 | PIX-centric; no localizado a CO |
| 2luv | BR | pago para quitar ads | 16 "cards"; 12 idiomas | Precio oculto; cards paywalled |
| Counting Loves | BR | $2.99 | Minimal, counter de días | Feature set fino; sin loop viral |
| Just Meant For You | — | free 7 días / pago | CTA "Create your own" persistente (único del set) | Modelo suscripción; moneda ambigua |
| TuCartaEterna | ES | gratis | Archivo `.html` local, sin servidores | **Sin URL → sin OG → sin viralidad** (trade-off explícito) |

### Huecos explotables (nuestra ventaja)

1. **El loop del receptor está huérfano.** Ningún competidor tiene un CTA fuerte post-reveal → Latido lo construye "adentro" del reveal.
2. **Art direction premium.** Todos usan estética template/emoji → Latido va editorial/cinematográfico.
3. **Fit de pagos CO/MX/AR.** Los probados son Brasil-only → Latido con Mercado Pago COP.
4. **Preview de link irresistible.** OG dinámico por pareja (nadie lo verificó en la competencia).
5. **Atacar el trade-off de TuCartaEterna:** "se ve en tu link, sin instalar nada, con vista previa bonita".

---

## 6. Arquitectura

```
Facebook Ads ──► Landing (Next.js, Meta Pixel) ──► Mercado Pago Checkout Pro
                                                        │ webhook
                                                        ▼
                                          n8n (posfinal-n8n)  ←──►  PostgreSQL
                                                        │              ▲
                                    email link Tally?code=┘              │
                                                                        │
      Tally ──webhook──► n8n ──fotos──► Cloudflare R2 ──────────────────┘
                         └─ QR PNG/PDF ──► email al comprador
Pareja: /s/<slug> (Next.js SSR + OG) ──► gate "raspar" ──► historia ──► share card + CTA "Creá la tuya"
```

| Pieza | Tecnología | Justificación |
|---|---|---|
| Web pública | **Next.js 15 (App Router) + TypeScript** | SSR para OG, imagen dinámica con `next/og`. |
| UI | **Tailwind CSS v4** + CSS variables | Tokens de diseño por plantilla. |
| Animación | **Motion** (motion.dev) + **canvas-confetti** | Reveals de alto impacto, accesibles. |
| Datos | **PostgreSQL 16** (contenedor dedicado) | `jsonb` para theme/couple_names; aislamiento del MySQL del salón. |
| Orquestación | **n8n 2.37.10 existente** (`posfinal-n8n`) | Ya corre; se le instala el node de MP. |
| Media | **Cloudflare R2** | Egress gratis, 10 GB free, dominio propio. |
| Pago | **Mercado Pago Checkout Pro** | Node oficial n8n `@mercadopago/n8n-nodes-mercadopago`. |
| Intake | **Tally free** | Uploads reales + webhook gratis (10 MB/foto). |
| Edge / TLS | **Caddy 2 existente** (`posfinal-caddy`) | Ya posee 80/443 y Let's Encrypt. |
| QR | **`node-qrcode`** | SVG/PNG, error correction H. |

**Decisión:** no se levanta otro reverse proxy ni otro n8n. El proyecto se une a la red externa `sistema-salon-belleza-gloss_posfinal-network`.

---

## 7. Motor viral (el gancho)

| # | Mecanismo | Implementación |
|---|---|---|
| V1 | **OG dinámico por pareja** | `app/s/[slug]/opengraph-image.tsx` con `ImageResponse` (1200×630). Muestra nombres, días juntos y 1 foto. Límites: OG ≤ 8 MB; bundle Satori ≤ 500 KB; **flexbox only**. |
| V2 | **Share card 1080×1920** | Render server-side (route `/api/share-card/[slug]`) + botón "Descargar" **siempre visible** (fallback obligatorio). |
| V3 | **`navigator.share`** | `canShare({files})` primero; si no hay soporte de archivos → descarga. **Firefox desktop no soporta share de archivos.** |
| V4 | **CTA post-reveal "Creá la tuya en 60s"** | Al final de la historia, prefill del mismo template. **El hueco #1 de la competencia.** |
| V5 | **Badge "hecho con Latido"** | Discreto, en la versión base. **No es gate** (permitido). |
| V6 | **Variante grupal / "amiga secreta"** (F2) | Cada contribuyente = usuario nuevo → K-factor estructural, sin incentivo. |

**Fraseo del CTA (sin incentivo, Meta-safe):** "Te quedó linda, ¿no? Creá la tuya →"

---

## 8. Sistema de diseño

### 8.1 Dirección visual

| Plantilla | Fase | Concepto | Paleta | Tipografías (Google Fonts) |
|---|---|---|---|---|
| **`midnight-letter`** | **MVP** | Editorial cinematográfico | `#0B0B0C` fondo · `#1F1B16` superficie · `#F5F1E8` papel · `#C8A24B` brass · `#A9A29A` texto secundario | **Fraunces** (display) · **Instrument Sans** (body) · **IBM Plex Mono** (detalle) |
| **`soft-luxe-paper`** | F2 | Lujo minimal | `#FAF7F0` crema · `#1A1A1A` tinta · `#C8B7A6` taupe · `#A6785A` cobre | **Cormorant Garamond** (display) · **Jost** (body) |
| **`neon-corazon`** | F2 | Wrapped vibrante | `#120B1A` base · gradientes `#FF0099→#493240`, `#7F00FF→#E100FF` · `#00E5FF` acento | **Sora** (display) · **Outfit** (body) |

Referencia de tendencia 2026: Pantone COTY **"Cloud Dancer" `#F2EFE9`** (off-white) → usar en `soft-luxe-paper`.

**EVITAR (estética AI-slop):** gradientes índigo/violeta `#6366F1 → #8B5CF6`, Inter en todo, glassmorphism excesivo, Space Grotesk, layouts predecibles.

### 8.2 Tokens CSS (plantilla MVP)

```css
:root {
  /* midnight-letter */
  --color-bg: #0B0B0C;
  --color-surface: #1F1B16;
  --color-paper: #F5F1E8;
  --color-accent: #C8A24B;
  --color-text: #F5F1E8;
  --color-text-muted: #A9A29A;
  --color-border: rgba(200, 162, 75, 0.25);

  --font-display: 'Fraunces', serif;
  --font-body: 'Instrument Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --radius-sm: 6px;
  --radius-md: 14px;
  --radius-lg: 24px;

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 40px;

  --duration-fast: 200ms;
  --duration-base: 600ms;
  --duration-slow: 900ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### 8.3 Reglas de verificación (obligatorias antes de aprobar UI)
- [ ] Contraste **WCAG AA**: cuerpo ≥ 4.5:1, texto grande ≥ 3:1. **Verificar con herramienta** (no asumir). El par `#F5F1E8`/`#0B0B0C` está diseñado para alto contraste; el acento `#C8A24B` **solo** para ≥ 18 px o elementos no textuales.
- [ ] Escala tipográfica fluida con `clamp()` (ej. `clamp(2rem, 8vw, 5rem)` para display).
- [ ] Foco visible por teclado en todos los controles.
- [ ] `prefers-reduced-motion: reduce` desactiva paralaje, count-up y confeti.
- [ ] Sin scroll horizontal en 320 px de ancho.
- [ ] `alt` en toda imagen; `aria-label` en el canvas de raspar.
- [ ] Textos de UI **en español**, revisados ortográficamente (tildes correctas).

---

## 9. Plantillas responsive

### 9.1 Estructura de la historia (`/s/[slug]`)

| Beat | Desktop | Mobile | Contenido |
|---|---|---|---|
| 0 | Gate | Gate | "Raspá para revelar" (canvas) |
| 1 | Hero | 1 pantalla | Nombres + fecha + contador de días |
| 2 | Galería | scroll-snap | Fotos (hasta 10) |
| 3 | Mensajes | 1 por pantalla | Mensajes (cliente o IA) |
| 4 | Video | 16:9 embed | YouTube |
| 5 | Cierre | 1 pantalla | Dedicatoria final + share card + CTA Latido |

- Scroll-snap + `IntersectionObserver` para animar al entrar.
- DOM en orden lógico (lectores de pantalla leen lineal).
- Duración de reveals 600–900 ms; un beat por viewport.

### 9.2 Gate "raspar" (crítico)

```
- Canvas con capa de cobertura + texto "Raspá acá".
- ctx.globalCompositeOperation = 'destination-out' al mover.
- Pointer Events (unifica mouse/touch/pen). NO handlers touch separados.
- touchmove con { passive: false } + preventDefault() para no scrollear.
- CSS: touch-action: none en el canvas.
- Escalar backing store por window.devicePixelRatio (si no, borroso en Retina).
- getContext('2d', { willReadFrequently: true }).
- Auto-reveal al ~55 % raspado (leer getImageData).
- Fallback accesible: botón "Revelar sin raspar" (a11y + reduced-motion).
- La fecha de aniversario es un JUEGO OPCIONAL posterior, NUNCA la única puerta.
```

### 9.3 Reglas responsive
- Mobile-first: diseñar a 360 px y escalar.
- Imágenes con `next/image`, `sizes` correcto, formatos AVIF/WebP.
- Sin `100vh` (usar `100dvh`) por las barras de Safari iOS.
- Fuentes con `next/font` (self-host, `display: swap`) → sin FOUT/CLS.

---

## 10. Modelo de datos (DDL)

```sql
-- PostgreSQL 16
CREATE TABLE orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code              text UNIQUE NOT NULL,             -- ej. LAT-7F3K9M (usado en Tally)
  status            text NOT NULL DEFAULT 'pending',  -- pending|paid|building|ready|delivered|failed
  buyer_name        text,
  buyer_email       text,
  buyer_phone       text,
  template_slug     text NOT NULL DEFAULT 'midnight-letter',
  amount_cop        integer,
  mp_preference_id  text,
  mp_payment_id     text,
  mp_status         text,
  external_reference text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  paid_at           timestamptz,
  delivered_at      timestamptz
);

CREATE TABLE pages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  slug             text UNIQUE NOT NULL,
  template_slug    text NOT NULL DEFAULT 'midnight-letter',
  couple_names     jsonb NOT NULL DEFAULT '{}'::jsonb,  -- { "a": "...", "b": "..." }
  anniversary_date date,
  youtube_url      text,
  theme            jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_at     timestamptz,
  expires_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id   uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  body      text NOT NULL,
  position  integer NOT NULL DEFAULT 0,
  origin    text NOT NULL DEFAULT 'client'              -- client|ai
);

CREATE TABLE photos (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id   uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  r2_key    text NOT NULL,
  url       text NOT NULL,
  position  integer NOT NULL DEFAULT 0,
  alt       text
);

CREATE TABLE events (
  id         bigserial PRIMARY KEY,
  page_id    uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type       text NOT NULL,                             -- view|reveal|share|cta_click
  created_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  referrer   text,
  ip_hash    text
);

CREATE TABLE webhook_events (                            -- idempotencia
  id           text PRIMARY KEY,                        -- mp_payment_id o tally_response_id
  source       text NOT NULL,                           -- mercadopago|tally
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_code ON orders(code);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_events_page_type ON events(page_id, type);
```

---

## 11. Flujos

### 11.1 Compra
1. Usuario entra desde el ad → landing (`/`) → Meta Pixel `PageView`.
2. Click "Crear mi sorpresa" → Mercado Pago (fase 0: link de pago; fase 1: Checkout Pro con `external_reference`).
3. MP dispara webhook → n8n `WF1` valida firma y consulta el pago.
4. Si `approved`: crea/actualiza `order` (status `paid`, genera `code`) → email con link `Tally?code=LAT-XXXX`.
5. Pixel `Purchase` en la página de gracias.

### 11.2 Intake
1. Comprador abre Tally con `?code=LAT-XXXX` (prefill oculto).
2. Envía 5–10 fotos + textos + URL de YouTube + template.
3. Tally dispara webhook → n8n `WF2` mapea por `code`.
4. n8n descarga fotos (links de Tally con token, sin login) → sube a R2 → crea `page`/`messages`/`photos` → `published_at`.
5. Genera QR (H) + PDF → email de entrega al comprador con URL + QR.

### 11.3 Apertura (receptor)
1. `/s/[slug]` SSR → OG dinámico.
2. Gate "raspar" → historia.
3. Al cierre: share card + CTA "Creá la tuya".
4. Se registran `events` (view/reveal/share/cta_click).

---

## 12. Workflows n8n

> Formato: exportar cada workflow a `infra/n8n/<nombre>.json` e importar en `posfinal-n8n` (`https://n8n.uniongloss.com`).
> Requiere instalar el node comunitario `@mercadopago/n8n-nodes-mercadopago` (o usar HTTP Request como fallback).

### WF1 — `mp-payment`
| Paso | Nodo | Detalle |
|---|---|---|
| 1 | Webhook (POST) | Path `/webhook/mp-payment`. Responder inmediato `200`. |
| 2 | Code | Validar `x-signature`: manifest `id:[data.id];request-id:[x-request-id];ts:[ts];`, HMAC-SHA256 hex con el secret de MP; comparar con `v1`. |
| 3 | Postgres (select) | Idempotencia: si `data.id` ya está en `webhook_events` → terminar. |
| 4 | HTTP Request | `GET https://api.mercadopago.com/v1/payments/{{data.id}}` con `Authorization: Bearer <MP_ACCESS_TOKEN>`. |
| 5 | IF | `status === "approved"`. |
| 6 | Postgres (upsert) | Crear `order` (status `paid`, `code` generado, `mp_payment_id`, `external_reference`). |
| 7 | Postgres (insert) | Registrar en `webhook_events`. |
| 8 | Email (SMTP) | Link a Tally con `?code=` + instrucciones. |

### WF2 — `tally-intake`
| Paso | Nodo | Detalle |
|---|---|---|
| 1 | Webhook (POST) | Path `/webhook/tally-intake`. Responder `200`. |
| 2 | Code | Mapear campos de Tally → estructura interna; leer `code`. |
| 3 | Postgres (select) | Buscar `order` por `code`; si no existe → alerta y fin. |
| 4 | HTTP Request (loop) | Descargar cada foto desde el link de Tally. |
| 5 | HTTP Request | Subir a R2 (`PUT` firmado o S3 API). |
| 6 | Postgres (insert) | Crear `page` + `messages` + `photos`. |
| 7 | Code | Generar `slug` (base32, 12 chars). |
| 8 | Code (QR) | Generar QR con `node-qrcode` (error correction **H**). |
| 9 | Postgres (update) | `order.status = 'ready'`, `delivered_at`. |
| 10 | Email (SMTP) | URL + QR PNG/PDF adjunto. |

### WF3 — `reminders` (opcional)
Cron diario: órdenes `paid` sin `page` tras 24 h → email recordatorio.

### WF4 — `deliver-qr` (opcional)
Reenvío manual del QR bajo demanda.

---

## 13. Mercado Pago

| Dato | Valor (verificado) |
|---|---|
| Checkout Pro en Colombia | **Sí**, moneda **COP**. Medios: tarjetas, wallet MP, **PSE**, **Efecty**. |
| Comisión | **3.29 % + $800 + IVA** (dinero ya) · **2.99 %** (7 días) · **2.79 %** (14 días). Sin costo fijo. |
| IVA Colombia | 19 % (enviar `unit_price` neto + `taxes`). |
| Webhook | `POST` JSON; `type: "payment"`, `action: payment.created|updated`, `data.id`. Responder **200 en < 22 s**. |
| Validación | `x-signature: ts=...,v1=...` → HMAC-SHA256 hex. |
| Aprobado | `GET /v1/payments/{id}` → `status === "approved"`. |
| Node n8n | `@mercadopago/n8n-nodes-mercadopago` (oficial, verificado). Fallback: HTTP Request. |

**Decisión de precio:** rango sugerido **$19.900–$39.900 COP**. `BLOQUEANTE`: confirmar comisión exacta de la cuenta MP antes de fijar precio final (las tarifas pueden depender del plan/antigüedad).

---

## 14. Tally

- Plan **free**: formularios ilimitados, **uploads reales**, **webhook incluido**, **10 MB por archivo**.
- Campos: `code` (oculto, prefill por URL), nombres, fecha de aniversario, URL de YouTube, template, 5–10 fotos, mensajes.
- Los links de archivo de Tally llevan token → descargables sin login.
- **Google Forms descartado**: archivos a Drive, trigger de Sheets solo da link, requiere login Google y no correlaciona pagos.

---

## 15. Cloudflare R2

- Bucket público servido por **dominio propio** (no `r2.dev` en producción). No se puede listar el contenido del bucket.
- Free tier: 10 GB-mes + egress gratis. Almacenamiento $0.015/GB-mes.
- `r2_key` por foto: `pages/<page_id>/<position>-<hash>.<ext>`.
- Subida desde n8n vía S3 API (compatible) o URL prefirmada.

---

## 16. QR y entrega

- Librería **`node-qrcode`**; **error correction level H** (tolerancia ~30 %) para impresión.
- Salidas: **SVG** (impresión) + **PNG alta resolución** (WhatsApp).
- PDF imprimible tipo tarjeta: QR + "Escaneá para tu sorpresa" + marca Latido + guía de quiet zone (margin 4 módulos).
- Entrega: email con adjuntos (SMTP). *(Fase 2: envío por WhatsApp Business API.)*

---

## 17. IA (fase 2)

- Modelo: **`deepseek-flash`** (DeepSeek-V4.1-Flash). Base URL `https://api.deepseek.com`, **compatible con OpenAI**.
- Alternativa: `deepseek-v4-pro`.
- Uso: generar 3–5 mensajes románticos a partir de nombres + fecha + intereses → el comprador elige/edita.
- **Nunca** publicar texto de IA sin revisión del comprador.

---

## 18. Docker / despliegue (VPS real `51.161.113.43`)

### 18.1 Estado actual de la VPS (verificado)
- Ubuntu **26.04 LTS**, kernel 7.0.0, **4 vCPU**, **7.6 GB RAM** (~5.4 GB disponibles), **62 GB libres**, **sin swap**.
- Docker **29.8.0**; usuario `ubuntu` en grupo `docker`.
- Stack existente `sistema-salon-belleza-gloss` corriendo:
  - `posfinal-caddy` (Caddy 2, **posee 80/443**), `posfinal-n8n` (**2.37.10**), `posfinal-mysql`, `posfinal-api`, `posfinal-dashboard`, `posfinal-superadmin`, `posfinal-phpmyadmin` (127.0.0.1:8082).
- Red: **`sistema-salon-belleza-gloss_posfinal-network`** (bridge, 172.18.0.0/16).
- Caddyfile montado desde `./docker/caddy/Caddyfile` (ro). Sitios: `uniongloss.com`, `www.`, `admin.`, `n8n.`.
- MySQL/phpMyAdmin **no** están expuestos públicamente (verificado en runtime). Público: 22, 80, 443.

### 18.2 Cambios requeridos en la VPS
1. **DNS**: agregar registro `A amor.uniongloss.com → 51.161.113.43`.
2. **Swap**: crear swapfile de 2 GB (sin swap hay riesgo de OOM).
3. **n8n**: instalar `@mercadopago/n8n-nodes-mercadopago`; alinear `GENERIC_TIMEZONE` a `America/Bogota`.
4. **Caddyfile**: agregar bloque (con backup previo + `caddy reload`, sin reiniciar contenedores del salón).

### 18.3 `infra/docker-compose.yml` (propuesto)

```yaml
# Latido — docker-compose.yml
# Se une a la red externa del salón para que Caddy lo alcance por nombre.
name: latido

services:
  web:
    build:
      context: ..
      dockerfile: apps/web/Dockerfile
    container_name: latido-web
    restart: unless-stopped
    env_file: ../.env
    environment:
      - NODE_ENV=production
      - TZ=America/Bogota
      - DATABASE_URL=postgres://latido:${POSTGRES_PASSWORD}@db:5432/latido
    depends_on:
      db:
        condition: service_healthy
    networks:
      - latido-internal
      - posfinal

  db:
    image: postgres:16-alpine
    container_name: latido-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: latido
      POSTGRES_USER: latido
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      TZ: America/Bogota
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U latido"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - latido-internal

volumes:
  pg_data:

networks:
  latido-internal:
    driver: bridge
  posfinal:
    external: true
    name: sistema-salon-belleza-gloss_posfinal-network
```

### 18.4 Bloque Caddy (agregar al Caddyfile existente)

```caddy
amor.uniongloss.com {
    reverse_proxy latido-web:3000
}
```

> **IMPORTANTE**: agregar **el nombre del contenedor** (`latido-web`) porque la red del salón resuelve por nombre de contenedor. Hacer `docker cp`/edición con backup del Caddyfile y luego `docker exec posfinal-caddy caddy reload --config /etc/caddy/Caddyfile`.

### 18.5 Reglas de despliegue
- **Ningún puerto publicado al host** (todo entra por Caddy).
- No tocar volúmenes `mysql_data`, `n8n_data`, `caddy_data` existentes.
- Backup del Caddyfile antes de editarlo.

---

## 19. Estructura del repo / SDD / skills

```
amor-amistad/
├── PLAN.md                     # este documento
├── AGENTS.md                   # convenciones para agentes
├── README.md
├── .env.example
├── openspec/
│   ├── config.yaml
│   ├── specs/
│   └── changes/
├── skills/                     # skills de proyecto (ver §19.2)
│   ├── latido-design-system/SKILL.md
│   └── n8n-webhook-conventions/SKILL.md
├── apps/
│   └── web/                    # Next.js 15
│       ├── app/
│       │   ├── page.tsx                    # landing
│       │   ├── s/[slug]/page.tsx           # página sorpresa (SSR)
│       │   ├── s/[slug]/opengraph-image.tsx
│       │   └── api/
│       │       ├── intake/route.ts
│       │       └── share-card/[slug]/route.ts
│       ├── components/
│       │   ├── templates/midnight-letter/
│       │   ├── ScratchGate.tsx
│       │   └── ShareCard.tsx
│       ├── lib/                # db, r2, qr, analytics
│       └── Dockerfile
├── infra/
│   ├── docker-compose.yml
│   ├── caddy/Caddyfile.latido.snippet
│   └── n8n/
│       ├── wf1-mp-payment.json
│       ├── wf2-tally-intake.json
│       ├── wf3-reminders.json
│       └── wf4-deliver-qr.json
└── docs/
```

### 19.2 Skills de proyecto (a crear)
- **`skills/latido-design-system/SKILL.md`**: paletas, fuentes, tokens, reglas de accesibilidad y responsive, prohibiciones estéticas.
- **`skills/n8n-webhook-conventions/SKILL.md`**: idempotencia, validación de firma MP, mapeo Tally, convenciones de nombres de workflows.

Ambas deben cumplir el formato de skill (frontmatter `name` + `description`).

---

## 20. Variables de entorno (`.env.example`)

```dotenv
# --- App ---
NEXT_PUBLIC_BRAND_NAME=Latido
NEXT_PUBLIC_BASE_URL=https://amor.uniongloss.com
NODE_ENV=production
TZ=America/Bogota

# --- Base de datos ---
POSTGRES_PASSWORD=cambiar_esto
DATABASE_URL=postgres://latido:cambiar_esto@db:5432/latido

# --- Mercado Pago ---
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=
MP_WEBHOOK_SECRET=

# --- Tally ---
TALLY_WEBHOOK_SECRET=

# --- Cloudflare R2 ---
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=latido
R2_PUBLIC_BASE_URL=https://media.uniongloss.com

# --- Email (SMTP) ---
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Latido <hola@uniongloss.com>"

# --- Meta Pixel ---
NEXT_PUBLIC_META_PIXEL_ID=

# --- IA (fase 2) ---
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-flash
```

---

## 21. Fases y criterios de aceptación

### Fases
| Fase | Alcance | Resultado |
|---|---|---|
| **F0** | dominio + MP link + Tally + 1 plantilla + QR | **Se puede pautar y cobrar** |
| **F1** | webhooks MP/Tally + Postgres + R2 + SSR/OG | Automatización end-to-end |
| **F2** | 2 plantillas + IA + grupos + analytics | Escala |

### Checklist de aceptación
- [ ] Pago de prueba en MP **aprueba** y crea `order`.
- [ ] El link `Tally?code=` **prefillea** el código y correlaciona con la orden.
- [ ] El formulario crea una página viva en `/s/<slug>` con fotos desde R2.
- [ ] **Preview OG correcto en WhatsApp** (imagen 1200×630 personalizada).
- [ ] Share card **1080×1920** descarga correctamente.
- [ ] QR escanea y abre la página desde 2 dispositivos.
- [ ] `prefers-reduced-motion` desactiva animaciones.
- [ ] Sin scroll horizontal a 320 px.
- [ ] `docker compose up -d` levanta **sin tumbar** el stack del salón.
- [ ] Lighthouse mobile ≥ 90 (Performance/SEO/Accessibility).
- [ ] Cero secretos en el repo.

---

## 22. Analytics y Meta Pixel

- **Meta Pixel** en la landing: `PageView`, `InitiateCheckout`, `Purchase`.
- **`events`** en la página sorpresa: `view`, `reveal`, `share`, `cta_click` (alimenta la medición del bucle viral).
- `ip_hash` con sal (nunca IP cruda).

---

## 23. Seguridad / privacidad / legal

| Tema | Acción |
|---|---|
| **Ley 1581 (Colombia)** | Consentimiento explícito para datos de terceros (la pareja); aviso de privacidad; derecho de supresión. |
| **Fotos** | Retención definida (`expires_at`); borrado bajo pedido. |
| **Música / video** | Solo embed de YouTube (sin archivos propios). |
| **Acceso a la página** | `noindex` + slug aleatorio; opcional PIN. |
| **Secretos** | Variables de entorno; nunca en el repo. |
| **n8n** | El editor está expuesto en `n8n.uniongloss.com` → asegurar autenticación. |

---

## 24. Riesgos y pendientes

| Riesgo / pendiente | Estado |
|---|---|
| Comisión exacta de MP para la cuenta | `BLOQUEANTE` — verificar en "Costos y comisiones" de la cuenta MP. |
| Precio final | `TODO` — rango $19.900–$39.900 COP. |
| Verificar post-reveal de 3–4 competidores en mobile real | `TODO` — único dato UNVERIFIED que decide la diferenciación. |
| Sub-bloques de plantillas F2 | `TODO` (fase 2). |
| Stories API (safe zones exactas) | `UNVERIFIED` — no bloquea MVP. |
| Sin swap en la VPS | Planificado: swapfile 2 GB. |
| OG ≤ 8 MB y bundle Satori ≤ 500 KB | Restricción técnica a respetar. |

---

## Apéndice A — Hechos verificados y fuentes

- **Mercado Pago Colombia**: Checkout Pro soporta COP y PSE/Efecty; comisión 3.29 %+$800+IVA / 2.99 % / 2.79 %. Fuentes: `mercadopago.com.co/herramientas-para-vender/check-out`, docs Checkout Pro, doc IVA Colombia.
- **DeepSeek**: ID `deepseek-flash` = DeepSeek-V4.1-Flash; base `https://api.deepseek.com`; compatible OpenAI. Fuente: `api-docs.deepseek.com`.
- **n8n + MP**: node `@mercadopago/n8n-nodes-mercadopago` (oficial). Fuente: npm + `n8n.io/integrations/mercadopago`.
- **Tally free**: uploads reales + webhook gratis, 10 MB/archivo. Fuente: `tally.so/help/file-uploads`.
- **R2**: egress gratis, 10 GB free. Fuente: `developers.cloudflare.com/r2/pricing`.
- **Next.js OG**: `ImageResponse` (1200×630 por defecto), flexbox only, bundle ≤ 500 KB, OG ≤ 8 MB. Fuente: `nextjs.org/docs`.
- **Web Share API**: ~92.7 % de soporte; **Firefox desktop no soporta**; requiere HTTPS + activación transitoria. Fuente: `caniuse.com/web-share`, MDN.
- **Meta Dev Policy §2.7**: prohibido incentivar/gatear share/like/tag. Fuente: `developers.facebook.com/devpolicy`.
- **Meta Ad Standards**: personal attributes, dating ads, video flashing. Fuente: `transparency.meta.com/policies/ad-standards`.
- **VPS**: inspección directa por SSH el 2026-09-17.

## Apéndice B — Pendientes antes de producción
1. Registrar DNS `amor`.
2. Crear swapfile 2 GB.
3. Instalar node MP en n8n + alinear TZ.
4. Backup + edición del Caddyfile.
5. Verificar contraste de colores con herramienta.
6. Revisar ortografía de todos los textos de UI.
