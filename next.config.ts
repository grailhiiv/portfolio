import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: { globalNotFound: true },
  turbopack: { root: process.cwd() },
  images: { qualities: [75, 90] },
  devIndicators: false,
};

export default config;
