import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
        search: '?prefix=media',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yourwebpage.ca',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
};

export default withPayload(nextConfig);
