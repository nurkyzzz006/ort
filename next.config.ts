import type { NextConfig } from "next";

// Адрес бэкенда. Запросы идут через прокси Next.js (/backend/...),
// чтобы не было проблем с CORS и смешанным контентом (https → http) на Vercel.
const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://16.179.209.67/orto/api/v1";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
