# Guía de despliegue — Latido (VPS + CI/CD)

Cómo está montado el despliegue continuo, qué se hizo una sola vez y cómo mantenerlo.
Mismo patrón que `sistema-salon-belleza-gloss`, adaptado a Latido.

---

## 1. El flujo

```
Tu PC                        GitHub                         VPS (51.161.113.43)
  │                            │                              │
  │ git push produccion        │                              │
  ├───────────────────────────►│                              │
  │                            │ GitHub Actions ejecuta       │
  │                            │ .github/workflows/deploy.yml │
  │                            │  (SSH con secrets)           │
  │                            ├─────────────────────────────►│
  │                            │  1. cd ~/amor-amistad        │
  │                            │  2. git pull origin produccion│
  │                            │  3. docker compose -f         │
  │                            │     docker-compose.prod.yml   │
  │                            │     up -d --build             │
  │                            │◄─────────────────────────────┤
```

**En criollo:** cada push/merge a `produccion` hace que GitHub entre a la VPS, baje el código
y reconstruya los contenedores. **Los cambios en `main` NO despliegan.**

### Flujo de trabajo recomendado

```bash
git checkout main
git pull origin main
git checkout produccion
git merge main
git push origin produccion     # ← esto dispara el deploy
```

---

## 2. Archivos que hacen posible el deploy

| Archivo | Para qué |
|---|---|
| `docker-compose.prod.yml` | Define los servicios en producción (`latido-web`, `latido-db`) |
| `apps/web/Dockerfile` | Construye la imagen de Next.js (`output: standalone`) |
| `infra/postgres/init.sql` | Esquema inicial de Postgres (se ejecuta en el primer arranque de la DB) |
| `.env.production.example` | Plantilla de variables; el workflow la copia a `.env` si no existe |
| `.github/workflows/deploy.yml` | El workflow de deploy |
| `infra/caddy/Caddyfile.latido.snippet` | Bloque de Caddy a agregar UNA vez en el salón |
| `infra/n8n/*.json` | Workflows de n8n (se importan a mano en la UI) |

---

## 3. Acceso a la VPS

```bash
ssh ubuntu@51.161.113.43
cd ~/amor-amistad
```

El `.env` real vive **solo en la VPS** (está en `.gitignore`).

---

## 4. Secrets de GitHub (cómo lo hace el otro proyecto)

GitHub Actions necesita credenciales para entrar a la VPS. Se guardan **por repositorio**,
encriptadas, en: **repo → Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Valor |
|---|---|
| `VPS_HOST` | `51.161.113.43` |
| `VPS_USER` | `ubuntu` |
| `VPS_SSH_KEY` | El contenido **completo** de tu clave privada (`~/.ssh/id_ed25519`, incluyendo las líneas `BEGIN`/`END`) |

> **Ojo:** los secrets **no se comparten entre repos**. Los de `sistema-salon-belleza-gloss`
> ya existen, pero hay que **volver a cargarlos en `amor-amistad`** con los mismos valores.
> GitHub no permite ver el valor de un secret ya guardado: para `VPS_SSH_KEY` hay que pegar
> de nuevo el contenido del archivo local (`cat ~/.ssh/id_ed25519`).

---

## 5. Caddy: la diferencia con el salón

- En `pos-final`, Caddy está **dentro** de su `docker-compose.prod.yml`, y el deploy lo recrea.
- En Latido, Caddy es **externo**: es el `posfinal-caddy` del salón, que ya ocupa 80/443.

Por eso:
1. El bloque se agrega **una sola vez** al Caddyfile del salón y se recarga.
2. El workflow **no** toca Caddy.

```bash
# En la VPS, dentro del proyecto del salón:
cd ~/sistema-salon-belleza-gloss
cp docker/caddy/Caddyfile docker/caddy/Caddyfile.bak      # backup
# agregar al final:
#   amor.uniongloss.com {
#       reverse_proxy latido-web:3000
#   }
docker exec posfinal-caddy caddy reload --config /etc/caddy/Caddyfile
curl -I https://amor.uniongloss.com
```

Caddy resuelve `latido-web` por **nombre de contenedor** (Docker DNS), por eso ambos
contenedores comparten la red `sistema-salon-belleza-gloss_posfinal-network`.

---

## 6. Swap en la VPS (ya creado)

El build de Next.js corre en la VPS y necesita memoria. Se creó un swapfile de 2 GB:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Verificar: `free -h` debe mostrar `Swap: 2.0Gi`.

---

## 7. Comandos útiles

```bash
# estado
cd ~/amor-amistad && docker compose -f docker-compose.prod.yml ps

# logs
docker logs latido-web
docker logs latido-db

# deploy manual (sin esperar el push)
cd ~/amor-amistad && git pull origin produccion && docker compose -f docker-compose.prod.yml up -d --build

# recrear solo el web
docker compose -f docker-compose.prod.yml up -d --build --force-recreate web

# backup de la base
docker exec latido-db pg_dump -U latido latido > ~/backup_latido_$(date +%Y%m%d).sql
```

---

## 8. Problemas conocidos y soluciones

| Problema | Causa | Solución |
|---|---|---|
| El build muere por memoria | VPS sin swap | Ya resuelto: swapfile 2 GB (§6) |
| `latido-web` no resuelve desde Caddy | Está en otra red | Ya resuelto: el compose une `web` y `db` a `posfinal` |
| n8n no conecta a la DB | `latido-db` sin la red `posfinal` | Ya resuelto; host de la credencial = `latido-db` |
| El deploy falla en `git pull` | Repo privado sin credenciales | El repo es **público** (igual que el salón) |
| HTTPS no emite certificado | Falta el DNS o el bloque en Caddy | Registrar `A amor.uniongloss.com → 51.161.113.43` y revisar §5 |
| El `.env` quedó con placeholders | El workflow lo creó desde el ejemplo | Editarlo en la VPS y re-deployar |
