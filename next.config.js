/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    env: process.env.NEXT_PUBLIC_ENV,
    API_ADDRESS: process.env.NEXT_PUBLIC_API_ADDRESS,
    NET_WORK: process.env.NET_WORK,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: false,
}

module.exports = nextConfig
