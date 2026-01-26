import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@platform/ui', '@platform/db', '@platform/auth'],
};

export default nextConfig;
