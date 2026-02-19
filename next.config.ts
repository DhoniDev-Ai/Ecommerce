import type { NextConfig } from "next";

// Check if we are running in production
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    // Only disable optimization locally to bypass the IP error
    unoptimized: !isProd,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rcrbbvnrkwjtyjyytarx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;