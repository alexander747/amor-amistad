import type { NextConfig } from 'next'

function parseHost(raw: string | undefined): {
  protocol: 'http' | 'https'
  hostname: string
} {
  try {
    const url = new URL(raw ?? 'https://media.uniongloss.com')
    return {
      protocol: url.protocol === 'http:' ? 'http' : 'https',
      hostname: url.hostname,
    }
  } catch {
    return { protocol: 'https', hostname: 'media.uniongloss.com' }
  }
}

const r2 = parseHost(process.env.R2_PUBLIC_BASE_URL)

const nextConfig: NextConfig = {
  output: 'standalone',
  // Fija la raíz del tracing al directorio de la app. Sin esto, Next infiere
  // la raíz por lockfiles y puede romper el `output: 'standalone'` en Docker.
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: r2.protocol, hostname: r2.hostname },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
}

export default nextConfig
