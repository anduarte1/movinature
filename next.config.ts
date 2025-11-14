import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if type errors.
    // Only use if you're confident in your type safety.
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add convex root to module resolution paths
    config.resolve.modules.push(path.resolve(__dirname));

    // Add alias for convex to help webpack find it - ensure it matches tsconfig
    config.resolve.alias = {
      ...config.resolve.alias,
      '@convex': path.resolve(__dirname, 'convex'),
    };

    // Add fallback for convex module resolution
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }

    return config;
  },
};

export default nextConfig;
