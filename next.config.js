/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    env: process.env.NEXT_PUBLIC_ENV,
    TEST_NETWORK_URL: process.env.NEXT_PUBLIC_JSONRPC_TEST_URL,
    MAIN_NETWORK_URL: process.env.NEXT_PUBLIC_JSONRPC_TEST_URL,
    MAIN_CHAIN_ID: process.env.NEXT_PUBLIC_MAIN_CHAIN_ID,
    CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    API_ADDRESS: process.env.NEXT_PUBLIC_API_ADDRESS
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  distDir: 'build',
}

module.exports = nextConfig
