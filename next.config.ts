import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 启用 Turbopack
  experimental: {
    // turbo 需要配置为对象，而不是布尔值
  },

  // 基础配置
  reactStrictMode: true,

  // 输出配置
  output: 'standalone',
};

export default nextConfig;
