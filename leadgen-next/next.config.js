/** @type {import('next').NextConfig} */
const nextConfig = {
  // For static export (GitHub Pages, etc.)
  output: "export",
  images: {
    unoptimized: true,
  },
  // For GitHub Pages: Replace 'ggrant111.github.io' with your actual GitHub username/org
  basePath: "/leadgen-next",
  trailingSlash: true,

  // For Docker deployment
  // output: 'standalone',
};

module.exports = nextConfig;
