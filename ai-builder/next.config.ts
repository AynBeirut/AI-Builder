import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "img-src 'self' data: https:",
              "font-src 'self' data: https://cdn.jsdelivr.net",
              "connect-src 'self' https://api.deepseek.com https://api.openai.com https://api.anthropic.com https://cdn.jsdelivr.net",
              "worker-src 'self' blob: data:",
              "child-src 'self' blob:",
            ].join('; ')
          }
        ]
      }
    ]
  }
};

export default nextConfig;
