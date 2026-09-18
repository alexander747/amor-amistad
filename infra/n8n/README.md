# Workflows n8n — Latido

Automatización de Latido: pago → intake → publicación → entrega del QR.

> **Decisión de arquitectura (verificada):** Latido **reutiliza el n8n existente** `posfinal-n8n`
> (`https://n8n.uniongloss.com`), compartido con el proyecto del salón.
> Alternativa descartada: n8n propio (más aislamiento, pero +1 contenedor y +1 subdominio).

Fuente de verdad del diseño: [`PLAN.md`](../../PLAN.md) §11–§16 y §10 (DDL).

---

## 1. Estado actual (verificado)

| Workflow | id | Nodos | Importado |
|---|---|---|---|
| `WF1 — Mercado Pago payment` | `YhZpiTpB7uU6cdlM` | 10 | ✅ |
| `WF2 — Tally intake` | `bE7niXvHRueUc7dd` | 25 | ✅ |
| `WF3 — Reminders (paid without page > 24h)` | `ymXpdkUa3adzkJB8` | 3 | ✅ |
| `WF4 — Deliver QR (on demand)` | `9s9JSfDRj9KoDIWc` | 11 | ✅ |

**Los 4 están inactivos a propósito** hasta que existan las credenciales (§4) y los secretos (§3).

---

## 2. Integración con el n8n del salón

Latido agregó al servicio `n8n` de `docker-compose.prod.yml` del **salón**
(commit `16fa27c`, rama `produccion`) estas variables. Los **valores** NO están en git: viven en
el `.env` de la VPS (`~/sistema-salon-belleza-gloss/.env`, prefijo `LATIDO_`).

| Variable en el contenedor n8n | Origen (`.env` del salón) | Para qué |
|---|---|---|
| `N8N_BLOCK_ENV_ACCESS_IN_NODE` | `"false"` (literal) | Permite leer `$env` dentro de nodos Code |
| `NEXT_PUBLIC_BASE_URL` | `LATIDO_BASE_URL` | Links públicos y URL del QR |
| `MAIL_FROM` | `LATIDO_MAIL_FROM` | Remitente de los emails |
| `ADMIN_EMAIL` | `LATIDO_ADMIN_EMAIL` | Alertas |
| `MP_WEBHOOK_SECRET` | `LATIDO_MP_WEBHOOK_SECRET` | Validar `x-signature` de Mercado Pago |
| `TALLY_WEBHOOK_SECRET` | `LATIDO_TALLY_WEBHOOK_SECRET` | Shared-secret del webhook de Tally |
| `TALLY_FORM_URL` | `LATIDO_TALLY_FORM_URL` | Link de intake en los emails |
| `LATIDO_ADMIN_SECRET` | `LATIDO_ADMIN_SECRET` | Protege WF4 |
| `R2_ACCOUNT_ID` | `LATIDO_R2_ACCOUNT_ID` | Subida a R2 |
| `R2_BUCKET` | `LATIDO_R2_BUCKET` | Bucket de fotos |
| `R2_PUBLIC_BASE_URL` | `LATIDO_R2_PUBLIC_BASE_URL` | URL pública de las fotos |

> **Por qué así:** si estos valores se pasaran fijos en el compose, los secretos quedarían en un
> repo **público**. El compose solo referencia `${LATIDO_*}`; el valor real está en `.env`.
>
> **Consecuencia:** `MP_WEBHOOK_SECRET`, `TALLY_WEBHOOK_SECRET`, `TALLY_FORM_URL`,
> `R2_ACCOUNT_ID` y `ADMIN_EMAIL` están **vacíos** hasta que cargues las credenciales (§4/§5).
> Un workflow activado con esos valores vacíos va a rechazar los webhooks (secreto vacío = no autorizado).

---

## 3. Nodo de Mercado Pago: NO se usa

El node comunitario `@mercadopago/n8n-nodes-mercadopago` **no se puede instalar** en este n8n:
depende de `isolated-vm` (módulo nativo) y el contenedor `n8nio/n8n` no trae toolchain
(python/make/g++). La instalación falla en `node-gyp`.

**No es bloqueante**: WF1 usa **HTTP Request** contra la API de Mercado Pago (fallback oficial del
PLAN §13). Si más adelante se quiere el node oficial, hace falta una imagen propia de n8n con
build tools, o usar el **Link de pago** manual del dashboard de MP (fase 0).

### QR: no requiere módulos en n8n

Los workflows **no** usan `require('qrcode')` (que exigiría `NODE_FUNCTION_ALLOW_EXTERNAL`).
El QR lo genera la app y n8n solo referencia la URL:

```
https://amor.uniongloss.com/api/qr/<slug>       → PNG 1024×1024, error correction H, margin 4
https://amor.uniongloss.com/api/qr/<slug>?w=512  → tamaño a medida (256–2048)
```

---

## 4. Credenciales a crear en n8n (manual, UI)

Los workflows referencian credenciales **por nombre**. Los nombres deben coincidir **exactamente**:

| Nombre | Tipo n8n | Campos | Nodos que la usan |
|---|---|---|---|
| `Latido Postgres` | Postgres | Host `latido-db`, puerto `5432`, DB `latido`, usuario `latido`, password = `POSTGRES_PASSWORD` del `.env` de Latido | 11 |
| `Latido SMTP` | SMTP | `SMTP_HOST`, `SMTP_PORT=587`, `SMTP_USER`, `SMTP_PASS` (TLS según proveedor) | 4 |
| `Mercado Pago API (Header Auth)` | Header Auth | Name `Authorization` · Value `Bearer <MP_ACCESS_TOKEN>` | 1 |
| `Cloudflare R2 (AWS IAM)` | AWS (IAM) | Access Key ID / Secret de R2, región `auto` **a verificar** | 1 |

> Al abrir cada workflow, n8n va a mostrar "credential not set". Abrir el nodo y elegir la
> credencial correspondiente.

---

## 5. Puesta en marcha

```bash
# 1. Cargar los secretos que faltan en el .env del salón (VPS)
nano ~/sistema-salon-belleza-gloss/.env
#    LATIDO_MP_WEBHOOK_SECRET, LATIDO_TALLY_WEBHOOK_SECRET, LATIDO_TALLY_FORM_URL,
#    LATIDO_R2_ACCOUNT_ID, LATIDO_ADMIN_EMAIL
# 2. Recrear SOLO n8n para que tome las variables
cd ~/sistema-salon-belleza-gloss
docker compose -f docker-compose.prod.yml up -d n8n
# 3. En la UI: crear las 4 credenciales (§4) y asignarlas
# 4. Activar los workflows (toggle "Active")
```

### Importar / re-importar workflows

```bash
# El JSON debe tener `id` (n8n lo exige en el import por CLI).
for f in wf1-mp-payment wf2-tally-intake wf3-reminders wf4-deliver-qr; do
  docker cp ~/amor-amistad/infra/n8n/$f.json posfinal-n8n:/tmp/$f.json
  docker exec posfinal-n8n n8n import:workflow --input=/tmp/$f.json
done
docker exec posfinal-n8n n8n list:workflow
```

### URLs de webhook

| Workflow | URL pública |
|---|---|
| WF1 | `https://n8n.uniongloss.com/webhook/mp-payment` |
| WF2 | `https://n8n.uniongloss.com/webhook/tally-intake` |
| WF4 | `https://n8n.uniongloss.com/webhook/deliver-qr?code=LAT-XXXXXX` (requiere header `x-latido-secret`) |

- WF1 → configurar en **Mercado Pago → Notificaciones webhook** (evento `payment`).
- WF2 → configurar en **Tally → Integrations → Webhooks**, con header `x-latido-secret`.
- Los webhooks usan `responseMode: onReceived`: responden `200` de inmediato (< 22 s de MP).

---

## 6. Idempotencia, firma y SQL

- **WF1**: valida `x-signature` (manifiesto `id:[data.id];request-id:[x-request-id];ts:[ts];`,
  HMAC-SHA256 hex con `MP_WEBHOOK_SECRET` contra `v1`), consulta `webhook_events` y luego hace
  `GET /v1/payments/{id}` — solo procesa si `status === "approved"`.
- **WF2**: exige header `x-latido-secret` == `TALLY_WEBHOOK_SECRET`; si no, responde `401`.
  Idempotencia por `tally_response_id`.
- **WF3**: deduplica con `webhook_events` (`reminder:<order_id>`, `ON CONFLICT DO NOTHING`)
  → máximo un recordatorio por orden. Requiere que el CHECK de `source` acepte `'reminder'`
  (ya está en `infra/postgres/init.sql`).
- **WF4**: exige header `x-latido-secret` == `LATIDO_ADMIN_SECRET`.
- **SQL**: todas las queries usan parámetros (`$1`, `$2`, …). Sin interpolación de valores.

---

## 7. TODOs reales

1. **Firma nativa de Tally**: WF2 usa shared-secret; reemplazar cuando se confirme el esquema.
2. **Manifiesto MP**: confirmar la plantilla exacta contra la doc vigente.
3. **R2 SigV4**: confirmar que la credencial AWS acepta `region=auto`.
4. **`Split Photos` sin fotos**: la rama no genera filas; blindar el caso borde.
5. **Alertas**: "Order Not Found" no envía alerta real (hoy es NoOp); usar `ADMIN_EMAIL`.
6. **PDF imprimible**: el email manda el link al PNG del QR; falta la tarjeta PDF.
