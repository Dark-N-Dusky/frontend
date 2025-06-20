import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'via.assets.so' },
      { protocol: 'https', hostname: 'media.croma.com' },
      { protocol: 'https', hostname: 'avatar.iran.liara.run', pathname: '/**' },
      { protocol: 'https', hostname: 'www.gonoise.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
