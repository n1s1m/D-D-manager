import type { NextConfig } from 'next';
import { withMicrofrontends } from '@vercel/microfrontends/next/config';
import { withVercelToolbar } from '@vercel/toolbar/plugins/next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['supabase-client', 'shared-types', '@repo/ui-components'],
  turbopack: {},
};

export default withVercelToolbar()(
  withMicrofrontends(nextConfig, { debug: true }),
);
