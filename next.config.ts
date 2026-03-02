import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: '(.*)path401(.*)' }],
        destination: '/401',
      },
      {
        source: '/',
        has: [{ type: 'host', value: '(.*)path403(.*)' }],
        destination: '/403',
      },
    ];
  },
};

export default nextConfig;
