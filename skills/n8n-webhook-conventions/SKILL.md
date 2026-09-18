---
name: n8n-webhook-conventions
description: Trigger - crear o editar workflows n8n de Latido, webhooks de Mercado Pago o Tally. Define idempotencia, validación de firma, mapeo y convenciones de nombres.
---

# Skill: n8n Webhook Conventions (Latido)

Aplicar SIEMPRE que se creen o editen workflows en `infra/n8n/`. Fuente extendida: `PLAN.md` §11–§14.

## Reglas duras

1. **Respuesta rápida**: todo webhook responde `200` **antes** de procesar (Respond to Webhook o respond immediately). Objetivo < 22 s (límite de Mercado Pago).
2. **Idempotencia obligatoria**: antes de procesar, insertar/buscar la clave de evento en la tabla `webhook_events` (PK = id del evento). Si ya existe → terminar sin reprocesar.
3. **Validación de firma MP**: header `x-signature: ts=...,v1=...`. Manifest:
   `id:[data.id];request-id:[x-request-id];ts:[ts];`
   Calcular HMAC-SHA256 en hex con `MP_WEBHOOK_SECRET` y comparar contra `v1`. Si no coincide → rechazar.
4. **Pago aprobado**: no confiar en el payload. Hacer `GET https://api.mercadopago.com/v1/payments/{data.id}` con `Authorization: Bearer <MP_ACCESS_TOKEN>` y verificar `status === "approved"`.
5. **Nunca** hardcodear credenciales: usar credenciales de n8n y variables de entorno. Documentar en el README del workflow.
6. **Nombres de tabla/columna**: exactamente los de `PLAN.md` §10.
7. Dejar `// TODO(latido):` donde falte una decisión. No inventar endpoints ni campos.

## Convenciones

- Nombre de workflow: `latido · <área> · <acción>` (ej. `latido · pay · mp-webhook`).
- Nombres de nodos en español, cortos y descriptivos.
- Webhooks: `https://n8n.uniongloss.com/webhook/<path>`.
  - `mp-payment` · `tally-intake`
- Un workflow por archivo: `infra/n8n/wf<N>-<nombre>.json`.
- Tags: `latido`, `fase-0` o `fase-1`.

## Mapeo Tally

- El campo `code` (oculto, prefill por URL `?code=`) es la clave de correlación con `orders.code`.
- Los links de archivos de Tally llevan token → descargables sin login.
- Si `code` no existe en `orders` → alerta y terminar (no crear páginas huérfanas).

## Errores y reintentos

- Configurar `retryOnFail` con backoff en nodos HTTP.
- En fallo definitivo: registrar y notificar (email/Slack), nunca fallar en silencio.
