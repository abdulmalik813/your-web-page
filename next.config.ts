import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const getImageRemotePatterns = () => {
  const hosts = [
    ...new Set(
      [process.env.IMAGE_HOSTS, process.env.NEXT_PUBLIC_SERVER_URL]
        .filter(Boolean)
        .join(',')
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean),
    ),
  ]

  return hosts.flatMap((host) => {
    const url = new URL(host.startsWith('http') ? host : `https://${host}`)
    const protocol = url.protocol.replace(':', '') as 'http' | 'https'
    const hostname = url.hostname

    const patterns: { protocol: 'http' | 'https'; hostname: string }[] = [{ protocol, hostname }]

    if (hostname !== 'localhost' && !hostname.startsWith('www.')) {
      const parts = hostname.split('.')
      if (parts.length === 2) {
        patterns.push({ protocol, hostname: `www.${hostname}` })
      }
    }

    return patterns
  })
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getImageRemotePatterns(),
    unoptimized: process.env.NODE_ENV === 'development',
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/api/thumbnails/file/**',
      },
      {
        pathname: '/api/font-files/file/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [75, 95],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development' ? { exclude: ['error', 'warn'] } : false,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.cts', '.cjs', '.mts', '.mjs', '.json'],
  },
  reactStrictMode: true,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
