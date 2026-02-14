import type { NextConfig } from 'next';
import { withMicrofrontends } from '@vercel/microfrontends/next/config';
import { withVercelToolbar } from '@vercel/toolbar/plugins/next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['supabase-client', 'shared-types', '@repo/ui-components'],
  turbopack: {},
  async rewrites() {
    return [
      { source: '/characters/api/:path*', destination: '/api/:path*' },
    ];
  },
};

export default withVercelToolbar()(
  withMicrofrontends(nextConfig, { debug: true }),
);
