import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: { globalNotFound: true, proxyClientMaxBodySize: 70_000_000 },
  turbopack: { root: process.cwd() },
  images: { qualities: [75, 90] },
  devIndicators: false,
  outputFileTracingIncludes: { "/strategy/audit": ["./src/app/strategy/audit/instructions/*.md"] },
};

export default config;
