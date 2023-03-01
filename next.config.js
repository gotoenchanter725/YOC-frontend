/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    env: process.env.NEXT_PUBLIC_ENV,
    TEST_NETWORK_URL: process.env.NEXT_PUBLIC_JSONRPC_TEST_URL,
    MAIN_NETWORK_URL: process.env.NEXT_PUBLIC_JSONRPC_TEST_URL,
    MAIN_CHAIN_ID: process.env.NEXT_PUBLIC_MAIN_CHAIN_ID,
    CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    API_ADDRESS: process.env.NEXT_PUBLIC_API_ADDRESS,

    AdminWalletAddress: process.env.AdminWalletAddress,
    ProjectManagerAddress: process.env.ProjectManagerAddress,
    ProjectDetailAddress: process.env.ProjectDetailAddress,
    WETH: process.env.WETH,
    YOCAddress: process.env.YOCAddress,
    USDCAddress: process.env.USDCAddress,
    YOCSwapFactoryAddress: process.env.YOCSwapFactoryAddress,
    YOCSwapRouterAddress: process.env.YOCSwapRouterAddress,
    YOCFarmAddress: process.env.YOCFarmAddress,
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
