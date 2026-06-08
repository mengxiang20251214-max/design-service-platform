import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 性能优化
  poweredByHeader: false,
  compress: true,

  // 图片优化
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: process.env.NODE_ENV === "development",
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },

  // 响应式设计支持
  reactStrictMode: true,

  // 输出配置
  output: "standalone",

  // 实验特性（使用 Turbopack）
  experimental: {
    optimizePackageImports: [
      "@/components",
      "@/lib",
      "lucide-react",
      "@radix-ui/react-dialog",
    ],
  },

  // Turbopack 配置（Next.js 16 默认使用）
  turbopack: {},

  // 安全头部
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
    ];
  },

  // 重定向配置
  redirects: async () => {
    return [];
  },
};

export default nextConfig;
