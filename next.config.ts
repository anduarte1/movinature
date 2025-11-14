import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    // Add convex root to module resolution paths
    config.resolve.modules.push(path.resolve(__dirname));

    // Add alias for convex to help webpack find it
    config.resolve.alias = {
      ...config.resolve.alias,
      '@convex': path.resolve(__dirname, 'convex'),
    };

    return config;
  },
};

export default nextConfig;
