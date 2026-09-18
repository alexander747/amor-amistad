# Workflows n8n — Latido

Exports de n8n para la automatización de Latido (pago → intake → entrega → recordatorios).
Todos se importan en el n8n **existente** `posfinal-n8n` (`https://n8n.uniongloss.com`).
Fuente de verdad del diseño: [`PLAN.md`](../../PLAN.md) §11–§16 y §10 (DDL).

| Archivo | Workflow | Trigger | Tablas que toca |
|---|---|---|---|
| `wf1-mp-payment.json` | WF1 — Mercado Pago payment | Webhook `POST /webhook/mp-payment` | `orders`, `webhook_events` |
| `wf2-tally-intake.json` | WF2 — Tally intake | Webhook `POST /webhook/tally-intake` | `orders` (read), `webhook_events`, `pages`, `messages`, `photos` |
| `wf3-reminders.json` | WF3 — Recordatorios | Schedule (cron diario 14:00) | `orders`, `pages` (read) |
| `wf4-deliver-qr.json` | WF4 — Entrega de QR a demanda | Webhook `POST /webhook/deliver-qr` | `orders`, `pages` (read) |

- **WF1** usa `responseMode: onReceived`: responde `200` de inmediato y sigue procesando, para
  cumplir el límite de Mercado Pago de **< 22 s** (PLAN §3, regla 6).
- **WF2 y WF4** usan `responseMode: responseNode` con un nodo *Respond to Webhook* ubicado apenas
  pasa el chequeo de secreto. Así devuelven un `401` real cuando falta o está mal el header
  `x-latido-secret`, y el `200` del caso válido se emite antes de empezar el trabajo pesado
  (R2, QR, email). La respuesta sigue siendo inmediata.

---

## 1. Node comunitario de Mercado Pago

PLAN §12: instalar `@mercadopago/n8n-nodes-mercadopago` en el n8n self-hosted `posfinal-n8n`.

> **NOTA**: WF1 usa **HTTP Request** (fallback oficial del PLAN) para consultar el pago, porque
> ese es el paso que explicita §12. El node comunitario queda instalado para crear preferencias
> de Checkout Pro (fase 1: automatizar el checkout con `external_reference`).

### Opción A — desde la UI (recomendada)

1. Entrar a `https://n8n.uniongloss.com`.
2. **Settings → Community nodes → Install a community node**.
3. Package name: `@mercadopago/n8n-nodes-mercadopago`.
4. Aceptar el aviso de riesgo e instalar. No requiere rebuild de la imagen (instala en el volumen `n8n_data`).
5. Si la sección no aparece, agregar al contenedor `N8N_COMMUNITY_PACKAGES_ENABLED=true` y reiniciar.

### Opción B — por CLI dentro del contenedor

```bash
docker exec -it posfinal-n8n npm install @mercadopago/n8n-nodes-mercadopago
docker restart posfinal-n8n
```

### Node `qrcode` (para WF2/WF4)

El nodo Code usa `require('qrcode')` (`node-qrcode`, PLAN §16). No viene con n8n:

```bash
docker exec -it posfinal-n8n npm install qrcode
```

y habilitar el require externo en el contenedor n8n:

```dotenv
NODE_FUNCTION_ALLOW_EXTERNAL=qrcode
```

Si no se puede, reemplazar los nodos **Generate QR** por un HTTP Request a un servicio de QR
(quedaría un `TODO` marcado en el propio nodo).

---

## 2. Variables de entorno

Se configuran en el contenedor `posfinal-n8n` (no en el repo; PLAN regla 9: cero secretos en git).

| Variable | Uso | Dónde |
|---|---|---|
| `MP_ACCESS_TOKEN` | `GET /v1/payments/:id` | Credencial *Header Auth* (WF1), no el código |
| `MP_WEBHOOK_SECRET` | Validar `x-signature` (HMAC-SHA256) | Code *Validate MP Signature* (WF1) |
| `TALLY_WEBHOOK_SECRET` | Validar el header `x-latido-secret` en WF2 | Code *Verify Tally Secret* |
| `LATIDO_ADMIN_SECRET` | Validar el header `x-latido-secret` en WF4 | Code *Verify Admin Secret* |
| `ADMIN_EMAIL` | Destino de las alertas administrativas (aún no cableado; ver TODOs) | WF2/WF4 (previsto) |
| `TALLY_FORM_URL` | Link de intake `?code=` en los emails | WF1 y WF3 |
| `NEXT_PUBLIC_BASE_URL` | Base de la URL pública `/s/<slug>` | WF2 y WF4 |
| `R2_ACCOUNT_ID` | Endpoint S3 de R2 | WF2 (Upload to R2) |
| `R2_BUCKET` | Bucket de R2 | WF2 |
| `R2_PUBLIC_BASE_URL` | Dominio público de las fotos | WF2 (Prepare R2 Object) |
| `MAIL_FROM` | Remitente de los emails | WF1, WF2, WF3, WF4 |

Para que las expresiones `{{ $env.* }}` funcionen dentro de nodos **Code**, el contenedor n8n
necesita:

```dotenv
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
GENERIC_TIMEZONE=America/Bogota   # PLAN §18.2
```

> `TALLY_FORM_URL` **no está** en `.env.example` / PLAN §20. Agregarla al `.env` de la VPS
> (ej. `https://tally.so/r/XXXXXX`). Este archivo no se modifica desde `infra/n8n/`.

---

## 3. Credenciales a crear en n8n

El JSON referencia credenciales **por nombre**, con un `id` placeholder (`REPLACE_*`).
Al importar, n8n mostrará "credential not set": abrir el nodo y elegir la credencial creada.
Los nombres deben coincidir exactamente con los de esta tabla.

| Nombre | Tipo n8n | Campos |
|---|---|---|
| `Latido Postgres` | Postgres | Host `latido-db`, puerto `5432`, DB `latido`, user `latido`, password `POSTGRES_PASSWORD` |
| `Latido SMTP` | SMTP | `SMTP_HOST`, `SMTP_PORT=587`, `SMTP_USER`, `SMTP_PASS`, SSL/TLS según proveedor |
| `Mercado Pago API (Header Auth)` | Header Auth | Name `Authorization` · Value `Bearer <MP_ACCESS_TOKEN>` |
| `Cloudflare R2 (AWS IAM)` | AWS (IAM) | Access Key ID / Secret de R2, **región `auto`** (verificar) |

---

## 4. Red (RESUELTO: n8n → Postgres)

En `infra/docker-compose.yml` el servicio `db` (`latido-db`) ahora está conectado a **ambas**
redes: `latido-internal` y `sistema-salon-belleza-gloss_posfinal-network`. Como `posfinal-n8n`
corre en esta última, **n8n ya resuelve `latido-db`**: el bloqueante anterior quedó resuelto.

> El host de la credencial Postgres debe ser `latido-db` (nombre de contenedor), **no** `db`,
> porque n8n está en la red `posfinal`. Verificar la resolución de nombres después de cada
> `docker compose up -d` en la VPS.

---

## 5. URLs de webhook

| Workflow | URL pública |
|---|---|
| WF1 | `https://n8n.uniongloss.com/webhook/mp-payment` |
| WF2 | `https://n8n.uniongloss.com/webhook/tally-intake` |
| WF4 | `https://n8n.uniongloss.com/webhook/deliver-qr?code=LAT-XXXXXX` |

- Configurar la URL de WF1 en **Mercado Pago → Notificaciones webhook** (evento `payment`).
- Configurar la URL de WF2 en **Tally → Integrations → Webhooks**.
- WF4 se llama manualmente con `?code=` en la query o `{"code":"LAT-..."}` en el body.
  **TODO**: proteger WF4 con un header secreto antes de exponerlo.

---

## 6. Importar los workflows

### Desde la UI

1. `https://n8n.uniongloss.com` → **Workflows → Import from File**.
2. Elegir cada `wf*.json` y guardar.
3. Reasignar credenciales en los nodos y **activar** el workflow (el toggle `Active`).

### Por CLI (alternativa)

```bash
# copiar el JSON al contenedor
docker cp wf1-mp-payment.json posfinal-n8n:/tmp/wf1-mp-payment.json
# importar
docker exec -it posfinal-n8n n8n import:workflow --input=/tmp/wf1-mp-payment.json
```

Repetir por archivo. Los workflows se importan **inactivos** (`active: false`) a propósito.

---

## 7. Idempotencia y firma

- **WF1**: valida `x-signature` (manifiesto `id:[data.id];request-id:[x-request-id];ts:[ts];`,
  HMAC-SHA256 hex con `MP_WEBHOOK_SECRET` comparado contra `v1`) y consulta `webhook_events`
  antes de procesar. El alta en `webhook_events` usa `ON CONFLICT DO NOTHING`.
- **WF2**: exige el header `x-latido-secret` igual a `TALLY_WEBHOOK_SECRET`; si no coincide,
  responde `401` y **no** procesa. Idempotencia por `tally_response_id` en `webhook_events`.
  TODO: reemplazar por la firma nativa de Tally cuando se confirme su esquema.
- **WF3**: deduplica con `webhook_events` usando la clave `reminder:<order_id>` y
  `ON CONFLICT DO NOTHING` → **como máximo un recordatorio por orden**.
  Para permitir uno por día, cambiar la clave a `reminder:<order_id>:<YYYY-MM-DD>`.
  > Requiere que el `CHECK` de `webhook_events.source` acepte `'reminder'` — ya incluido
  > en `infra/postgres/init.sql`.
- **WF4**: exige el header `x-latido-secret` igual a `LATIDO_ADMIN_SECRET`; si no, responde `401`.
- **SQL**: todas las queries del proyecto usan parámetros (`$1`, `$2`, …). No queda
  interpolación de valores en el texto SQL.

---

## 8. TODOs / incertidumbres

Estado: los bloqueantes de red y de SQL ya están resueltos. Queda lo siguiente:

1. **Firma nativa de Tally**: WF2 usa shared-secret (`x-latido-secret`). Reemplazar por la
   firma oficial de Tally cuando se confirme el esquema.
2. **Manifiesto MP**: confirmar la plantilla exacta contra la doc vigente de MP por si cambió.
3. **R2 SigV4**: el nodo *Upload to R2* usa la credencial AWS (IAM). Confirmar que R2 acepta
   `region=auto`; si no, firmar con un Code node (SigV4) o usar un PUT prefirmado.
4. **`node-qrcode`**: no viene con n8n; instalar y habilitar `NODE_FUNCTION_ALLOW_EXTERNAL`.
5. **`Split Photos` + `Collect Photos`**: si el formulario llega sin fotos, la rama no genera
   filas; el MVP exige 5–10 fotos, pero conviene blindar el caso borde.
6. **Alertas**: "Order Not Found" no envía alerta real (solo NoOp); usar `ADMIN_EMAIL`.
7. **PDF imprimible**: el QR se envía embebido (data URI), no como PNG/PDF adjunto (PLAN §16).
8. **Variables nuevas**: `TALLY_FORM_URL`, `LATIDO_ADMIN_SECRET` y `ADMIN_EMAIL` ya están en
   `.env.example`.

## 9. Renombrar nodos

Las expresiones usan `$('Nombre del nodo')` (ej. `$('Validate MP Signature')`,
`$('Insert Page')`). Si se renombra un nodo en la UI hay que actualizar esas referencias.
