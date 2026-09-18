import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Cliente S3-compatible para Cloudflare R2.
 *
 * En el MVP la subida de fotos la hace n8n (WF2) directo contra R2 (PLAN §15).
 * Este cliente queda disponible para tareas del web (firmar lecturas privadas,
 * borrado por derecho de supresión, etc.).
 *
 * TODO(latido): confirmar el flujo definitivo de subida (PUT firmado vs. S3 API
 * desde n8n) antes de exponer escritura desde el web.
 */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  )
}

export function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'R2 is not configured. Check R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY.',
    )
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export function publicUrlFor(key: string): string {
  const base = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  const clean = key.replace(/^\//, '')
  return base ? `${base}/${clean}` : clean
}

export async function createUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 600,
): Promise<string> {
  const bucket = process.env.R2_BUCKET
  if (!bucket) throw new Error('R2_BUCKET is not set.')
  return getSignedUrl(
    getR2Client(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: expiresInSeconds },
  )
}

export async function createDownloadUrl(
  key: string,
  expiresInSeconds = 600,
): Promise<string> {
  const bucket = process.env.R2_BUCKET
  if (!bucket) throw new Error('R2_BUCKET is not set.')
  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresInSeconds },
  )
}
