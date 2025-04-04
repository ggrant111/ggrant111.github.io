/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Vercel deployment with API support
  output: "standalone",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  // Remove basePath for Vercel deployment
  // basePath: "/leadgen-next",
  trailingSlash: true,

  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
