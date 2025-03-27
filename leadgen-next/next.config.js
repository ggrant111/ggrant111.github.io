/** @type {import('next').NextConfig} */
const nextConfig = {
  // For static export
  output: "export",
  images: {
    unoptimized: true,
  },
  // Remove basePath for Vercel deployment
  // basePath: "/leadgen-next",
  trailingSlash: true,

  // For Docker deployment
  // output: 'standalone',

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
