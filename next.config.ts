import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        // Appwrite Cloud storage (user avatars), including regional hosts like fra.cloud.appwrite.io
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
      },
      {
        protocol: 'https',
        hostname: '*.cloud.appwrite.io',
      },
    ],
  },
};

export default nextConfig;
