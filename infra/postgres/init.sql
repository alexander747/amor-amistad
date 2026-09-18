-- ============================================================
-- Latido — esquema inicial (PostgreSQL 16)
-- Ejecutado automáticamente por el contenedor `latido-db`
-- en el primer arranque (docker-entrypoint-initdb.d).
-- Fuente: PLAN.md §10.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS orders (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code               text UNIQUE NOT NULL,
  status             text NOT NULL DEFAULT 'pending',
  buyer_name         text,
  buyer_email        text,
  buyer_phone        text,
  template_slug      text NOT NULL DEFAULT 'midnight-letter',
  amount_cop         integer,
  mp_preference_id   text,
  mp_payment_id      text,
  mp_status          text,
  external_reference text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  paid_at            timestamptz,
  delivered_at       timestamptz,
  CONSTRAINT orders_status_chk CHECK (
    status IN ('pending','paid','building','ready','delivered','failed')
  )
);

CREATE TABLE IF NOT EXISTS pages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  slug             text UNIQUE NOT NULL,
  template_slug    text NOT NULL DEFAULT 'midnight-letter',
  couple_names     jsonb NOT NULL DEFAULT '{}'::jsonb,
  anniversary_date date,
  youtube_url      text,
  theme            jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_at     timestamptz,
  expires_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id  uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  body     text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  origin   text NOT NULL DEFAULT 'client',
  CONSTRAINT messages_origin_chk CHECK (origin IN ('client','ai'))
);

CREATE TABLE IF NOT EXISTS photos (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id  uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  r2_key   text NOT NULL,
  url      text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  alt      text
);

CREATE TABLE IF NOT EXISTS events (
  id         bigserial PRIMARY KEY,
  page_id    uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  referrer   text,
  ip_hash    text,
  CONSTRAINT events_type_chk CHECK (type IN ('view','reveal','share','cta_click'))
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id           text PRIMARY KEY,
  source       text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  -- 'reminder' lo usa WF3 para deduplicar recordatorios (ver infra/n8n/README.md §7).
  CONSTRAINT webhook_events_source_chk CHECK (source IN ('mercadopago','tally','reminder'))
);

CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_mp_payment_id ON orders(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_events_page_type ON events(page_id, type);
