import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'example.com' },
      { protocol: 'https', hostname: 'via.assets.so' },
      { protocol: 'https', hostname: 'media.croma.com' },
      { protocol: 'https', hostname: 'avatar.iran.liara.run' },
      { protocol: 'https', hostname: 'www.gonoise.com' },
    ],
  },
};

export default nextConfig;
